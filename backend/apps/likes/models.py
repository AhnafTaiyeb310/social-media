from django.db import models
from django.conf import settings
from apps.blog.models import Post


class PostLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='post_likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes') 
    created_at = models.DateTimeField(auto_now_add=True) 

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user','post'], name='unique_post_like')
        ]
        indexes = [
            models.Index(fields= ['user', 'post'])
        ]

    def __str__(self):
        return f"{self.user} liked {self.post}"
    