from django.urls import path
from rest_framework import routers
from . import views
from .auth_views import LoginView, RefreshView, LogoutView, RegisterView
from .socials_auth_views import GoogleLoginView, FacebookLoginView

# Profile and User ViewSets
router = routers.DefaultRouter()
router.register('profile', views.ProfileViewSet, basename='profile')
router.register('profiles', views.ProfileFollowViewset, basename='profiles')

urlpatterns = [
    # Auth endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),

    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Force profile/me to be handled before the ViewSet lookup captures it
    path('profile/me/', views.ProfileViewSet.as_view({'get': 'me', 'put': 'me', 'patch': 'me'}), name='profile-me'),

    # Social Auth endpoints
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/facebook/', FacebookLoginView.as_view(), name='facebook-login'),
]

urlpatterns += router.urls
