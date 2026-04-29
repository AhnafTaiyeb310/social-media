from django.urls import path, include
from rest_framework import routers
from . import views

# Profile and User ViewSets
router = routers.DefaultRouter()
router.register('profile', views.ProfileViewSet, basename='profile')
router.register('profiles', views.ProfileFollowViewset, basename='profiles')

urlpatterns = [
    # Auth endpoints via dj-rest-auth
    path('auth/', include('dj_rest_auth.urls')),
    # Custom verify-email MUST come before dj-rest-auth registration includes
    path('auth/registration/verify-email/', views.VerifyEmailAPIView.as_view(), name='verify-email'),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

    # Force profile/me to be handled before the ViewSet lookup captures it
    path('profile/me/', views.ProfileViewSet.as_view({'get': 'me', 'put': 'me', 'patch': 'me'}), name='profile-me'),

    # Social Auth endpoints
    path('auth/google/', views.GoogleLogin.as_view(), name='google-login'),
    path('auth/facebook/', views.FacebookLogin.as_view(), name='facebook-login'),
]

urlpatterns += router.urls
