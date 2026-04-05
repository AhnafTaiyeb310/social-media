from pathlib import Path
from datetime import timedelta
from decouple import config
from urllib.parse import urlparse
import os
import cloudinary
import cloudinary.api
import cloudinary.uploader

# -------------------------------
# Build paths
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

# -------------------------------
# Environment variables
# -------------------------------
SECRET_KEY = config('SECRET_KEY', cast=str)
DEBUG = config('DEBUG', cast=bool, default=True)


# -------------------------------
# Sentry Settings
# -------------------------------
import logging
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.logging import LoggingIntegration

# 1. Setup Sentry
sentry_sdk.init(
    dsn=config('SENTRY_DSN'), 
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True,
    # Enable sending logs to Sentry
    enable_logs=True,
)

# 2. Now just use standard Python logging anywhere in your app
logger = logging.getLogger(__name__)

def trigger_error(request):
    logger.error("Someone hit the error trigger!") # This goes to Sentry
    return 1 / 0

# ------------------------------------------------------------------------------
# SECURITY & SESSION SETTINGS (Consolidated)
# ------------------------------------------------------------------------------
if not DEBUG:
    # --- PRODUCTION SETTINGS (Render/Vercel) ---
    SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', cast=bool, default=True)
    
    # Cookies must be Secure (HTTPS only) and SameSite=None for cross-domain auth
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'
    CSRF_COOKIE_SAMESITE = 'None'
    AUTH_COOKIE_SAMESITE = 'None'
    
    # HSTS (Strict Transport Security)
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Browser-level protections
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    
    # JWT Auth Cookie Security (Production)
    AUTH_COOKIE_SECURE = True

else:
    # --- LOCAL DEVELOPMENT SETTINGS ---
    SECURE_SSL_REDIRECT = False
    
    # Allow cookies over plain HTTP for local testing
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SAMESITE = 'Lax'
    
    # Disable HSTS locally so you don't get locked out of http://127.0.0.1
    SECURE_HSTS_SECONDS = 0
    
    # JWT Auth Cookie Security (Local)
    AUTH_COOKIE_SECURE = False

# Global Settings (Apply to both environments)
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # Set to False so Frontend (Next.js) can read the token
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin-allow-popups"

# -------------------------------
# Security & Hosts
# -------------------------------
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# CORS Settings
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000').split(',')]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-requested-with',
    'authorization',
    'content-type',
    'accept',
    'origin',

]

CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in config('CSRF_TRUSTED_ORIGINS', default='http://localhost:3000,http://127.0.0.1:3000').split(',')]
CSRF_COOKIE_NAME = "csrftoken"
CSRF_COOKIE_HTTPONLY = False
CSRF_USE_SESSIONS = False


# -------------------------------
# Application definition
# -------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloudinary_storage', 
    'django.contrib.sites',
]

EXTERNAL_APPS = [
    # DRF
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt.token_blacklist',

    # Utils
    'drf_yasg',
    'storages',
    'corsheaders',
    "django_extensions",
    "django_filters",
    'cloudinary',
    'celery',
    'django_celery_beat',
    
    # Auth
    'rest_framework_simplejwt',

    # Local Dynamic Apps
    
    'apps.blog',
    'apps.comments',
    'apps.likes',
    'apps.tags',
    'apps.utils',

    'apps.users',
]

INSTALLED_APPS += EXTERNAL_APPS

# -------------------------------
# Middleware
# -------------------------------
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASE_URL = config("DATABASE_URL", default=None)

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
elif DATABASE_URL:
    tmpPostgres = urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': tmpPostgres.path.replace('/', ''),
            'USER': tmpPostgres.username,
            'PASSWORD': tmpPostgres.password,
            'HOST': tmpPostgres.hostname,
            'PORT': tmpPostgres.port,
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': config('DB_ENGINE', default='django.db.backends.postgresql'),
            'NAME': config('DB_NAME', default='test-db'),
            'USER': config('DB_USER', default='test-user'),
            'PASSWORD': config('DB_PASSWORD', default='test-password'),
            'HOST': config('DB_HOST', default='localhost'),
            'PORT': config('DB_PORT', default='5432'),
        }
    }

# -------------------------------
# Auth & JWT
# -------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"] if (BASE_DIR / "static").exists() else []


# settings.py

if DEBUG:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
else:
    STORAGES = {
        "default": {"BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"},
        "staticfiles": {
            # Use the most basic WhiteNoise backend to stop the 'FileNotFound' crashes
            "BACKEND": "whitenoise.storage.StaticFilesStorage", 
        },
    }
    # to satisfy the cloudinary-storage library's internal check
    # and avoid crashes during collectstatic (especially for Swagger UI files)
STATICFILES_STORAGE = 'whitenoise.storage.StaticFilesStorage'
WHITENOISE_MANIFEST_STRICT = False


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_PAGINATION_CLASS": "core.pagination.DefaultPagination",
    "PAGE_SIZE": 10,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# Cookie Settings for JWT Refresh Token
AUTH_COOKIE = "refresh_token"
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_SECURE = not DEBUG
AUTH_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
AUTH_COOKIE_PATH = '/'

# Social Auth Settings
GOOGLE_CLIENT_ID = config('GOOGLE_CLIENT_ID', default='')
FACEBOOK_APP_ID = config('FACEBOOK_APP_ID', default='')
FACEBOOK_APP_SECRET = config('FACEBOOK_APP_SECRET', default='')


SITE_ID = 1
AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
)
AUTH_USER_MODEL = "users.CustomUser"


# Cloudinary settings
cloudinary.config(
    cloud_name = config("CLOUD_NAME"),
    api_key = config("API_KEY"),
    api_secret = config("API_SECRET"),
    
)

# Celery Configuration
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default="redis://redis:6379/0")
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default="redis://redis:6379/0")
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"

from celery.schedules import crontab

# CELERY BEAT SCHEDULE
CELERY_BEAT_SCHEDULE = {
    'weekly-cleanup-all-tmp': {
        'task': 'apps.utils.tasks.purge_old_tmp_files', 
        'schedule': crontab(hour=0, minute=0, day_of_week=1), 
    },
}

# Deployment
import dj_database_url
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# This logic automatically picks the right DB
if os.environ.get('DATABASE_URL'):
    # If we are on Render/Production
    DATABASES = {
        'default': dj_database_url.config(conn_max_age=600)
    }
else:
    # If we are working locally on your laptop
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }