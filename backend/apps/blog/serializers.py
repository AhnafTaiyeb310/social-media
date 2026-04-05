import cloudinary
import os
import uuid
import logging
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from . import models
from .tasks import upload_post_image_task
from apps.tags.models import Tag, TaggedItem
from apps.users.serializers import ProfileListSerializer
from apps.comments.serializers import CommentSerializer

import cloudinary.uploader

logger = logging.getLogger(__name__)

class CategorySerializer(ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'title', 'slug', 'parent']
        
MAX_IMAGE_SIZE = 10 * 1024 * 1024

class PostImageSerializer(ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image = serializers.CharField(read_only=True)

    class Meta:
        model = models.PostImages
        fields = ['id', 'image_url', 'image'] 

    def get_image_url(self, obj):
        if obj.image:
            return cloudinary.utils.cloudinary_url(obj.image, secure=True)[0]
        return None

    def create(self, validated_data):
        post_id = self.context['post_id']
        return models.PostImages.objects.create(post_id= post_id, **validated_data)

class PostSerializer(ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset = models.Category.objects.all(),
        write_only = True,
        allow_null = True,
        required = False,
    )

    display_category = serializers.StringRelatedField(source='category')
    author = serializers.ReadOnlyField(source='author.username')
    author_profile = ProfileListSerializer(source='author.profile', read_only=True)
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        required=False,
        write_only=True
    )

    images = PostImageSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.BooleanField(read_only=True, default=False)
    
    tags = serializers.SerializerMethodField()
    # Accept a list of strings for tags (names)
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False,
        write_only=True
    )

    comments = CommentSerializer(many= True, read_only = True)

    class Meta:
        model = models.Post
        fields = ['id', 
                'title', 
                'slug', 
                'content', 
                'excerpt', 
                'author', 
                'author_profile',
                'status', 
                'visibility', 
                'created_at', 
                'updated_at', 
                'published_at', 
                'scheduled_for', 
                'category',
                'display_category',
                'uploaded_images',
                'images',
                'likes_count',
                'comments_count',
                'is_liked',
                'tags',
                'tag_names',
                'comments'
                ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'published_at', 'author']
        
    def get_tags(self, obj):
        content_type = ContentType.objects.get_for_model(obj)
        tagged_items = TaggedItem.objects.filter(content_type=content_type, object_id=obj.id).select_related('tag')
        return [item.tag.tag for item in tagged_items]

    def _handle_tags(self, post, tag_names):
        if tag_names is None:
            return
            
        
        content_type = ContentType.objects.get_for_model(post)
        
        # Clear existing tags if any
        TaggedItem.objects.filter(content_type=content_type, object_id=post.id).delete()
        
        for name in tag_names:
            tag_obj, _ = Tag.objects.get_or_create(tag=name.lower().strip())
            TaggedItem.objects.get_or_create(
                tag=tag_obj,
                content_type=content_type,
                object_id=post.id
            )

    def _handle_images(self, post, image_data):
        if not image_data:
            return

        for image_file in image_data:
            try:
                upload_result = cloudinary.uploader.upload(
                    image_file, 
                    folder="blog/images/",
                    resource_type="auto"
                )
                models.PostImages.objects.create(
                    post=post, 
                    image=upload_result['public_id']
                )
            except Exception as e:
                print(f"CLOUDINARY_UPLOAD_ERROR: {e}")
                models.PostImages.objects.create(post=post, image=None)

    def create(self, validated_data):
        image_data = validated_data.pop('uploaded_images', []) or []
        tag_names = validated_data.pop('tag_names', [])
        
        # Ensure author is set from context if not already in data
        if 'author' not in validated_data and 'request' in self.context:
            validated_data['author'] = self.context['request'].user

        with transaction.atomic():
            post = models.Post.objects.create(**validated_data)
            self._handle_images(post, image_data)
            if tag_names:
                self._handle_tags(post, tag_names)
        return post

    def update(self, instance, validated_data):
        image_data = validated_data.pop('uploaded_images', []) or []
        tag_names = validated_data.pop('tag_names', None)

        with transaction.atomic():
            post = super().update(instance, validated_data)
            self._handle_images(post, image_data)
            if tag_names is not None:
                self._handle_tags(post, tag_names)
        return post
