from django.db import models
from django.conf import settings 
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile',)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=100, default="Member", db_index=True)
    birth_date = models.DateField(blank=True, null=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    
    # Social links
    twitter_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    
    # Followers system
    followers = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='following_profiles', 
        blank=True
    )

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'
    
    @property
    def followers_count(self):
        return self.followers.count()
    
    @property
    def following_count(self):
        return Profile.objects.filter(followers__in=[self.user]).count()

    class Meta:
        ordering = ['user__first_name', 'user__last_name']
        indexes = [
            models.Index(fields=['is_verified']),
            models.Index(fields=['role']),
        ]