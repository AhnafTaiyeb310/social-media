from rest_framework import routers
from . import views

router = routers.DefaultRouter()

router.register('profile', views.ProfileViewSet, basename='profile')
router.register('profile-follow', views.ProfileViewSet, basename='profile-follow')

urlpatterns = router.urls
