from django.forms import ValidationError
from rest_framework import serializers
from . import models

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
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
                'author',
                'likes_count',
                'is_liked',
                'replies',
                ]
        read_only_fields = ['created_at', 'updated_at', 'author']

    def get_replies(self, obj):
        # Only show first level of replies to prevent infinite deep recursion
        # but the recursive call handles further nesting
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
            if not guest_name or not guest_email:
                raise ValidationError("Guest name or email are required for anonymous comments.")

        return attrs