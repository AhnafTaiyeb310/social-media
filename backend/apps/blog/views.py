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


class PostModelViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.select_related('category', 'author').prefetch_related('images').all()
    serializer_class = serializers.PostSerializer
    filter_backends = [DjangoFilterBackend,SearchFilter, OrderingFilter]
    filterset_fields = ['author', 'category', 'status']
    ordering_fields = ['created_at', 'likes_count']
    pagination_class = FeedPagination
    search_fields = ['title', 'content', 'excerpt']

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

    
    @action(detail=False, methods=['GET'] , permission_classes=[IsAuthenticated], )
    def feed(self, request):
        user = request.user
        posts = models.Post.objects.filter( 
            Q(author__in = user.following.values_list('user', flat=True))  |  
            Q(author_id = user.id)
            ).select_related('author', 'category'
            ).prefetch_related("images", "likes__user"
            ).annotate(
                likes_count = Count('likes'),
                comments_count = Count('comments'),
                is_liked = Exists(
                    PostLike.objects.filter(
                        user = user,
                        post = OuterRef('pk')
                    )
                )
            ).order_by('-created_at')
        serializer = serializers.PostSerializer(posts, many=True)
        return Response(serializer.data)




class PostImageModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PostImageSerializer

    def get_queryset(self):
        return models.PostImages.objects.filter(post_id = self.kwargs['post_pk'])
        
    def get_serializer_context(self):
        return {'post_id': self.kwargs['post_pk']}
    
    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('image')

        # 2. Save the database record WITHOUT the image file
        # By passing image=None, we stop the "TypeError" because 
        # the serializer won't try to save the file object to the CharField.
        instance = serializer.save(image=None)

        if file_obj:
            # 3. Create the local folder
            tmp_dir = os.path.join(settings.MEDIA_ROOT, 'tmp')
            os.makedirs(tmp_dir, exist_ok=True)

            # 4. Generate the unique local path
            file_extension = os.path.splitext(file_obj.name)[1]
            unique_name = f"post_{instance.id}_{uuid.uuid4()}{file_extension}"
            tmp_path = os.path.join(tmp_dir, unique_name)

            # 5. Write the binary bits to your local disk
            with default_storage.open(tmp_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)

            # 6. Tell Celery: "Here is the DB ID and the file path, go!"
            upload_post_image_task.delay(instance.id, tmp_path)
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

