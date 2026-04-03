from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
from apps.blog.models import Post
from apps.users.models import Profile
from apps.tags.models import Tag
from apps.blog.serializers import PostSerializer
from apps.users.serializers import ProfileSerializer
from apps.tags.serializers import TagSerializer

class GlobalSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({
                "posts": [],
                "users": [],
                "tags": []
            })

        # 1. Search Posts
        posts = Post.objects.filter(
            Q(title__icontains=query) | 
            Q(content__icontains=query) |
            Q(status='published')
        ).select_related('author', 'category').prefetch_related('images')[:5]

        # 2. Search Users (Profiles)
        profiles = Profile.objects.filter(
            Q(user__username__icontains=query) |
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query)
        ).select_related('user')[:5]

        # 3. Search Tags
        tags = Tag.objects.filter(tag__icontains=query)[:10]

        return Response({
            "posts": PostSerializer(posts, many=True, context={'request': request}).data,
            "users": ProfileSerializer(profiles, many=True, context={'request': request}).data,
            "tags": TagSerializer(tags, many=True).data
        })
