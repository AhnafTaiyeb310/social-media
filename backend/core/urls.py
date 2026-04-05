from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# --------------------------------------
# DRF-YASG API Documentation
# --------------------------------------
schema_view = get_schema_view(
    openapi.Info(
        title="social_media API",
        default_version='v1',
        description="API documentation for social_media",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# --------------------------------------
# Sentry Error Trigger
# --------------------------------------
def trigger_error(request):
    division_by_zero = 1 / 0

# --------------------------------------
# Redirect backend root to docs
# --------------------------------------
def redirect_to_docs(request):
    """Redirect root URL to API documentation"""
    return redirect('schema-swagger-ui')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sentry-debug/', trigger_error),

    # Main API Endpoints
    path('api/', include([
        path('', include('apps.users.urls')),
        path('', include('apps.blog.urls')),
        path('', include('apps.tags.urls')),
        path('', include('apps.utils.urls')),
        
        # API Documentation
        path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    ])),

    # Redirect root to docs
    path('', redirect_to_docs),
]

# sentry error trigger
def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns += [
    path('sentry-debug/', trigger_error),
    # ...
]
import sentry_sdk

# Send logs directly to Sentry
sentry_sdk.logger.info('This is an info log message')
sentry_sdk.logger.warning('This is a warning message')
sentry_sdk.logger.error('This is an error message')