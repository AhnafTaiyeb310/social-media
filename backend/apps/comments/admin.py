from django.contrib import admin
from . import models

@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author_display', 'post_title', 'content_snippet', 'status', 'created_at', 'parent_id']
    list_filter = ['status', 'created_at']
    search_fields = ['content', 'author__username', 'post__title']
    list_editable = ['status']
    raw_id_fields = ['author', 'post', 'parent']
    date_hierarchy = 'created_at'
    
    def author_display(self, obj):
        return obj.author.username if obj.author else "Guest"
    author_display.short_description = 'Author'

    def post_title(self, obj):
        return obj.post.title
    post_title.short_description = 'Post'

    def content_snippet(self, obj):
        if len(obj.content) > 50:
            return f"{obj.content[:50]}..."
        return obj.content
    content_snippet.short_description = 'Comment'

@admin.register(models.CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'comment_snippet']
    search_fields = ['user__username', 'comment__content']
    raw_id_fields = ['user', 'comment']

    def comment_snippet(self, obj):
        if len(obj.comment.content) > 50:
            return f"{obj.comment.content[:50]}..."
        return obj.comment.content
