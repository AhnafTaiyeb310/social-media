from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username', 'first_name', 'last_name']

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Profile
        fields = [
            'id', 'user_id', 'username', 'first_name', 'last_name', 
            'bio', 'profile_picture', 'role', 'birth_date', 
            'is_verified', 'twitter_url', 'github_url', 'website_url',
            'followers_count', 'following_count'
        ]

# list profile to show followers/following
class  ProfileListSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    class Meta:
        model = models.Profile
        fields = [
            'id', 'user_id', 'username', 
            'first_name', 'last_name', 
            'profile_picture', 'is_verified'
            ]