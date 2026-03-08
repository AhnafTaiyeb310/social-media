from django.db import transaction
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from . import models
from apps.tags.models import Tag, TaggedItem

class CategorySerializer(ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'title', 'slug', 'parent']
        
MAX_IMAGE_SIZE = 10 * 1024 * 1024

class PostSerializer(ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset = models.Category.objects.all(),
        write_only = True,
        allow_null = True,
        required = False,
    )

    display_category = serializers.StringRelatedField(source='category')
    author = serializers.ReadOnlyField(source='author.username')
    uploaded_images = serializers.ListField(
        child= serializers.ImageField(max_length=1000000,
        allow_empty_file= False,
        use_url=False,
        write_only= True,
        required= False,
        )
    )

    likes_count = serializers.IntegerField(read_only=True)
    tags = serializers.PrimaryKeyRelatedField(
        queryset = Tag.objects.all(),
        many = True,
        required = False
    )

    class Meta:
        model = models.Post
        fields = ['id', 
                'title', 
                'slug', 
                'content', 
                'excerpt', 
                'author', 
                'status', 
                'visibility', 
                'created_at', 
                'updated_at', 
                'published_at', 
                'scheduled_for', 
                'category',
                'display_category',
                'uploaded_images',
                'likes_count',
                'tags',
                ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'published_at', 'author']
        
    def validate_uploaded_images(self, value):
        for image_file in value:
            if image_file.size > MAX_IMAGE_SIZE:
                raise serializers.ValidationError("Max image size can be 10MB")

    def create(self, validated_data):
        image_data = validated_data.pop('uploaded_images',[])
        tags_data = validated_data.pop('tags', [])

        image_instances = []
        with transaction.atomic():
            post = models.Post.objects.create(**validated_data)
            if image_data:
                image_instances = [
                    models.PostImages(post= post, image= image_file)
                    for image_file in image_data
                ]
            if image_instances:
                models.PostImages.objects.bulk_create(image_instances)

        tag_instances = []
        tag_instances = [
            TaggedItem(tag = tag ,content_object = post)
            for tag in tags_data
        ]
        TaggedItem.objects.bulk_create(tag_instances)
        return post
    
class PostImageSerializer(ModelSerializer):

    class Meta:
        model = models.PostImages
        fields = ['id', 'image']

    def create(self, validated_data):
        post_id = self.context['post_id']
        return models.PostImages.objects.create(post_id= post_id, **validated_data)