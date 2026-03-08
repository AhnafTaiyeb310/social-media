from rest_framework import serializers
from . import models
class PostLikeSerializer(serializers.ModelSerializer):
    username = serializers.CharField('user.username', read_only= True)
    class Meta:
        model = models.PostLike
        fields = ['id', 'username', 'created_at']