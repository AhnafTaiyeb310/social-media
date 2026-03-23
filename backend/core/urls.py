from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect


#--------------------------------------
# DRF-YASG API Documentation
#--------------------------------------
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="social_media API",
        default_version='v1',
        description="API documentation for social_media",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
#--------------------------------------



#--------------------------------------
# Sentry Error Trigger
#--------------------------------------
def trigger_error(request):
    division_by_zero = 1 / 0
#--------------------------------------



#--------------------------------------
# Redirect backend root to docs
#--------------------------------------
def redirect_to_docs(request):
    """Redirect root URL to API documentation"""
    return redirect('schema-swagger-ui')
#--------------------------------------



from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sentry-debug/', trigger_error),

    # Local app routes
    path('users/', include('apps.users.urls')),
    path("", include("apps.blog.urls")),
    path("", include("apps.tags.urls")),

    # Allauth Headless (BFF Authentication Strategy)
    path('accounts/', include('allauth.urls')),
    path("_allauth/", include("allauth.headless.urls")),

    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]