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
    
    # Make names writeable by removing read_only=True
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    
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

    def get_profile_picture_url(self, obj):
        if obj.profile_picture:
            # Check if it's a CloudinaryField object or string
            if hasattr(obj.profile_picture, 'url'):
                return obj.profile_picture.url
            return cloudinary.utils.cloudinary_url(str(obj.profile_picture), secure=True)[0]
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False

    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        return super().update(instance, validated_data)

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
            if hasattr(obj.profile_picture, 'url'):
                return obj.profile_picture.url
            return cloudinary.utils.cloudinary_url(str(obj.profile_picture), secure=True)[0]
        return None

    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.followers.filter(id=request.user.id).exists()
        return False
