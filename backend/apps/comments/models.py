from django.db import models
from django.conf import settings
from apps.blog.models import Post

class Comment(models.Model):
    STATUS_CHOICE = [
        ('pending',"Pending"),
        ('approved', 'Approved'),
        ('spam','Spam'),
    ]

    content = models.TextField()
    guest_name = models.CharField(max_length=255, blank=True, null=True)
    guest_email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICE, default= 'pending', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies', db_index=True)
    
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, db_index=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments', db_index=True)

    def __str__(self):
        if self.author:
            return f'{self.author.username} - {self.content[0:30]}'
        else:
            return f'{self.guest_name} - {self.content[0:30]}'
    
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', 'status']),
            models.Index(fields=['post', 'created_at']),
            models.Index(fields=['parent', 'created_at']),
        ]

class CommentLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,)

    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name="likes"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "comment"],
                name="unique_comment_like"
            )
        ]