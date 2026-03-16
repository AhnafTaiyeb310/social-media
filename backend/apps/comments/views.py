from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from . import serializers
from . import models

class CommentModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CommentSerializer
    
    def get_queryset(self):
        # Only show Top-Level comments by default to avoid showing replies twice
        queryset = models.Comment.objects.filter(
            post_id = self.kwargs['post_pk'],
            status='approved'
        ).select_related('author' ,'post').prefetch_related('replies', 'likes')
        
        # If user wants a specific comment, don't filter parent
        if self.action == 'retrieve':
            return models.Comment.objects.all()
            
        return queryset.filter(parent__isnull=True)

    @action(detail=True, methods=['POST'], permission_classes=[IsAuthenticated])
    def like(self, request, post_pk=None, pk=None):
        comment = self.get_object()
        user = request.user
        
        like_obj, created = models.CommentLike.objects.get_or_create(
            user=user, 
            comment=comment
        )

        if not created:
            like_obj.delete()
            liked = False
        else:
            liked = True
            
        return Response({
            "liked": liked, 
            "total_likes": comment.likes.count()
        }, status=status.HTTP_200_OK)

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        post_id = self.kwargs['post_pk']

        if self.request.user.is_authenticated:
            return serializer.save(author= self.request.user, post_id = post_id)
        else:
            return serializer.save(post_id= post_id)