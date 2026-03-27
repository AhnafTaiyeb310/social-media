from django.contrib import admin
from django import forms
from .models import Post, PostImages
from cloudinary.forms import CloudinaryFileField

class PostImageAdminForm(forms.ModelForm):
    image = CloudinaryFileField()

    class Meta:
        model = PostImages
        fields = ['post', 'image']

class PostImageInline(admin.TabularInline):
    model = PostImages
    form = PostImageAdminForm
    extra = 1

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'created_at']
    list_filter = ['status', 'visibility', 'created_at']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PostImageInline]

@admin.register(PostImages)
class PostImagesAdmin(admin.ModelAdmin):
    form = PostImageAdminForm
    list_display = ['post', 'image', 'created_at']
