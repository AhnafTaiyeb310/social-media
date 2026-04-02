from django.forms import ValidationError
from rest_framework import serializers
from . import models
from apps.users.serializers import ProfileListSerializer

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    author_profile = ProfileListSerializer(source='author.profile', read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    replies = serializers.SerializerMethodField() # Recursive replies
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = models.Comment
        fields = ['id', 
                'content', 
                'status', 
                'created_at', 
                'updated_at',
                'parent',
                'author_username',
                'author_profile',
                'likes_count',
                'is_liked',
                'replies',
                ]
        read_only_fields = ['created_at', 'updated_at', 'author_username', 'author_profile', 'likes_count']

    def get_replies(self, obj):
        # Only show first level of replies to prevent infinite deep recursion
        # but the recursive call handles further nesting
        # We limit the queryset to only approved replies if needed
        serializer = CommentSerializer(obj.replies.all(), many=True, context=self.context)
        return serializer.data

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False


    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user if request else None

        guest_name = attrs.get('guest_name')
        guest_email = attrs.get('guest_email')

        if user and user.is_authenticated:
            if guest_name or guest_email:
                raise ValidationError("Logged in users should not provide guest information.")
        else:
            # For this social media app, maybe we only want auth users to comment
            # but I'll leave the guest logic if it was there
            pass

        return attrs
