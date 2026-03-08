from rest_framework import viewsets

from . import models
from . import serializers


class PostLikeModelViewset(viewsets.ModelViewSet):
    serializer_class = serializers.PostLikeSerializer

    def get_queryset(self):
        post = self.get_object()
        return models.PostLike.objects.filter(post = post)
    