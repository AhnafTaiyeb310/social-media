from django.db import models
from django.conf import settings
from django.utils.text import slugify
from cloudinary.models import CloudinaryField


class Category(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', db_index=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = 'Categories'
        indexes = [
            models.Index(fields=['parent']),
        ]


class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
        ('archived', 'Archived'),
    ]
    VISIBILITY_CHOICES =[
        ('public', 'Public'),
        ('private', 'Private'),
        ('password', 'Password Protected')
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True,db_index=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default= 'draft', db_index=True)
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    scheduled_for = models.DateTimeField(null=True, blank=True, db_index=True)
    
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, db_index=True)
    

    class Meta:
        indexes = [
            models.Index(fields=['status', 'visibility']),
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['author', 'status']),
        ]

    # --- START: Robust Slug Generation ---
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        return super().save(*args, **kwargs)
    # --- END: Robust Slug Generation ---


    def __str__(self):
        return self.title
    

class PostImages(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', folder='blog/images/', overwrite= True)

    
