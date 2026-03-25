import pytest
from django.urls import reverse
from model_bakery import baker
from apps.blog.models import Post, Category
from rest_framework import status

@pytest.mark.django_db
class TestPostsAPI:
    def test_list_posts(self, api_client):
        # Create some posts
        baker.make(Post, _quantity=3)
        
        url = reverse('posts-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        # Check if we have results in pagination (assuming FeedPagination is used)
        assert 'results' in response.data
        assert len(response.data['results']) == 3

    def test_create_post_unauthorized(self, api_client):
        url = reverse('posts-list')
        data = {
            'title': 'Test Post',
            'content': 'Test Content'
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_post_authenticated(self, authenticated_client, db):
        category = baker.make(Category)
        url = reverse('posts-list')
        data = {
            'title': 'New Post',
            'content': 'Some content',
            'category': category.id,
            'status': 'published'
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Post'
        assert Post.objects.count() == 1

    def test_like_post(self, authenticated_client, user):
        post = baker.make(Post)
        url = reverse('posts-like', kwargs={'pk': post.pk})
        
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['liked'] is True
        assert response.data['total_likes'] == 1
        
        # Unlike
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['liked'] is False
        assert response.data['total_likes'] == 0
