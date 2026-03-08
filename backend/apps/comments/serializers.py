from django.forms import ValidationError
from rest_framework import serializers
from . import models

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    class Meta:
        model = models.Comment
        fields = ['id', 
                'content', 
                'guest_name', 
                'guest_email', 
                'status', 
                'created_at', 
                'updated_at',
                'parent',
                'author',
                'post',
                ]
        read_only_fields = [
            'created_at', 
            'updated_at',
            'author',
            'post',
        ]

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