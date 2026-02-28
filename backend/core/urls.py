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



urlpatterns = [
    path('admin/', admin.site.urls),

    # Sentry Error Trigger
    path('sentry-debug/', trigger_error),

    # Local app routes (v1 prefix)
    
    path('v1/users/', include('apps.users.urls')),
    
    
    # API Documentation
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),

    #auth
    path("accounts/", include("allauth.urls")),
    path("_allauth/", include("allauth.headless.urls")),
    
    # Redirect root to docs
    # path('', redirect_to_docs, name='root-redirect'),
]