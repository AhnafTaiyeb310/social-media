from django.urls import path
from .views import GlobalSearchAPIView

urlpatterns = [
    path('global-search/', GlobalSearchAPIView.as_view(), name='global-search'),
]
