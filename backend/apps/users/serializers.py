import cloudinary
from rest_framework import serializers
from . import models

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.CustomUser
        fields = ['id', 'email', 'username', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = models.CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = models.CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)
    followers_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = models.Profile
        fields = [
            'id', 'user_id', 'email', 'username', 'first_name', 'last_name', 
            'bio', 'profile_picture_url', 'profile_picture', 'role', 'birth_date', 
            'is_verified', 'twitter_url', 'github_url', 'website_url',
            'followers_count', 'following_count', 'is_following', 'date_joined'
        ]
        read_only_fields = ['profile_picture']

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return cloudinary.utils.cloudinary_url(obj.profile_picture)[0]
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False

# list profile to show followers/following
class ProfileListSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    profile_picture_url = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = models.Profile
        fields = [
            'id', 'user_id', 'username', 
            'first_name', 'last_name', 
            'profile_picture_url', 'is_verified',
            'is_following'
            ]

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            return cloudinary.utils.cloudinary_url(obj.profile_picture)[0]
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False
