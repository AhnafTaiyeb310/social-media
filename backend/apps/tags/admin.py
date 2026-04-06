from django.contrib import admin
from .models import Tag, TaggedItem

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['tag']
    search_fields = ['tag']

@admin.register(TaggedItem)
class TaggedItemAdmin(admin.ModelAdmin):
    list_display = ['tag', 'content_type', 'object_id', 'content_object']
    list_filter = ['content_type']
    search_fields = ['tag__tag']
