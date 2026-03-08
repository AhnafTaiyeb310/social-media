from django.urls import path
from . import views
from rest_framework_nested import routers
from apps.comments.views import CommentModelViewSet

router = routers.DefaultRouter()

router.register("posts/categories", views.CategoryModelViewSet, basename="categories")
router.register("posts", views.PostModelViewSet, basename="posts")

posts_router = routers.NestedDefaultRouter(router, 'posts', lookup='post')
posts_router.register("images", views.PostImageModelViewSet, basename="post-images")
posts_router.register("drafts", views.DraftPostModelViewSet, basename="draft-posts")

posts_router.register("comments", CommentModelViewSet, basename="posts-comments")

urlpatterns = router.urls + posts_router.urls
