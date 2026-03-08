from rest_framework import viewsets 
from . import serializers
from . import models

class CommentModelViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CommentSerializer
    
    def get_queryset(self):
        return models.Comment.objects.filter(post_id = self.kwargs['post_pk']).select_related('author' ,'post')

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        post_id = self.kwargs['post_pk']

        if self.request.user.is_authenticated:
            return serializer.save(author= self.request.user, post_id = post_id)
        else:
            return serializer.save(post_id= post_id)