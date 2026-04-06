from django.db.models import Q, Count, OuterRef, Exists
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from . import models
from . import serializers
from .permissions import isOwner
from apps.likes.models import PostLike
from core.pagination import FeedPagination

import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from .tasks import upload_post_image_task


from core.pagination import FeedPagination, DefaultPagination


class PostModelViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.select_related('category', 'author').prefetch_related('images').all()
    serializer_class = serializers.PostSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['author', 'category', 'status']
    ordering_fields = ['created_at', 'likes_count']
    pagination_class = DefaultPagination

    def get_queryset(self):
        user = self.request.user
        queryset = models.Post.objects.select_related('category', 'author').prefetch_related('images').all()
        
        # 0. Hide drafts from non-authors
        if user.is_authenticated:
            # Authors can see their own drafts, others only see published
            queryset = queryset.filter(Q(status='published') | Q(author=user))
        else:
            # Anonymous users only see published
            queryset = queryset.filter(status='published')

        # 1. Filter by specific tag if provided (Exact match)
        tag_name = self.request.query_params.get('tag')
        if tag_name:
            from apps.tags.models import TaggedItem
            from django.contrib.contenttypes.models import ContentType
            content_type = ContentType.objects.get_for_model(models.Post)
            post_ids = TaggedItem.objects.filter(
                content_type=content_type, 
                tag__tag=tag_name
            ).values_list('object_id', flat=True)
            queryset = queryset.filter(id__in=post_ids)
            
        # 2. Unified Search (Text OR Tag)
        search_query = self.request.query_params.get('search')
        if search_query:
            from apps.tags.models import TaggedItem
            from django.contrib.contenttypes.models import ContentType
            content_type = ContentType.objects.get_for_model(models.Post)
            
            # Post IDs where tags match
            tagged_post_ids = TaggedItem.objects.filter(
                content_type=content_type,
                tag__tag__icontains=search_query
            ).values_list('object_id', flat=True)
            
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(content__icontains=search_query) |
                Q(excerpt__icontains=search_query) |
                Q(id__in=tagged_post_ids)
            ).distinct()

        # 3. Handle standard filters (author, category, status, username)
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
            
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(author__username=username)
            
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author= self.request.user)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), isOwner()]
        
        return [IsAuthenticated()]

    @action(detail=False, methods=['GET'], url_path='my-posts', permission_classes=[IsAuthenticated])
    def my_posts(self, request):
        posts = self.get_queryset().filter(author = request.user).order_by('-created_at')
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user

        # if post.author_id == user.id:
        #     return Response({"detail": "You cannot like your own post"}, status=status.HTTP_400_BAD_REQUEST)
        
        like_obj, created = PostLike.objects.get_or_create(post=post, user=user)

        if not created:
            like_obj.delete()
            liked = False
        else:
            liked = True
        total_likes = PostLike.objects.filter(post_id= post.id).count()
        return Response({"liked": liked, "total_likes": total_likes}, status=status.HTTP_200_OK)         

    
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def feed(self, request):
        user = request.user
        followed_user_ids = user.following_profiles.values_list('user_id', flat=True)
        
        from django.db.models import Case, When, Value, IntegerField
        
        priority_score = Case(
            When(author=user, then=Value(1)),
            When(author_id__in=followed_user_ids, then=Value(2)),
            default=Value(3),
            output_field=IntegerField(),
        )

        posts = models.Post.objects.filter(
            status='published'
        ).select_related(
            'author', 'author__profile', 'category'
        ).prefetch_related(
            "images", "likes", "comments"
        ).annotate(
            priority=priority_score,
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True),
            is_liked=Exists(
                PostLike.objects.filter(user=user, post=OuterRef('pk'))
            )
        ).order_by('priority', '-created_at')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)




class PostImageModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PostImageSerializer

    def get_queryset(self):
        post_id = self.kwargs.get('post_pk')
        if post_id:
            return models.PostImages.objects.filter(post_id = post_id)
        return models.PostImages.objects.none()
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['post_id'] = self.kwargs.get('post_pk')
        return context
    
    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('image')

        if file_obj:
            try:
                import cloudinary.uploader
                upload_result = cloudinary.uploader.upload(file_obj, folder="blog/images/")
                serializer.save(image=upload_result['public_id'])
            except Exception as e:
                print(f"CLOUDINARY_UPLOAD_ERROR: {e}")
                serializer.save(image=None)
        else:
            serializer.save(image=None)
class DraftPostModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return models.Post.objects.filter(
                author=self.request.user, 
                status='draft'
            ).order_by('-created_at')
        return models.Post.objects.none()
    
    
class CategoryModelViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

