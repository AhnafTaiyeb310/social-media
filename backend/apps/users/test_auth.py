import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status

User = get_user_model()

@pytest.mark.django_db
class TestAuthAPI:
    def test_register_user(self, api_client):
        url = reverse('register')
        data = {
            'email': 'new@example.com',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'Password123!',
            'confirm_password': 'Password123!'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['message'] == "User created successfully"
        assert 'access' in response.data
        assert response.data['user']['email'] == 'new@example.com'
        assert User.objects.filter(email='new@example.com').exists()

    def test_login_user(self, api_client, user):
        # Setup user with password
        user.set_password('testpass123')
        user.save()
        
        url = reverse('login')
        data = {
            'username': user.email,  # Django authenticate uses 'username' kwarg but maps to email
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        # Check if cookie is set (Refresh token is in cookie)
        assert 'refresh_token' in response.cookies

    def test_logout_user(self, authenticated_client):
        url = reverse('logout')
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        # Check if cookie is deleted (should have an expiry in the past or be empty)
        assert 'refresh_token' in response.cookies
        assert response.cookies['refresh_token'].value == ''
