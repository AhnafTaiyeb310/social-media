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

# AWS Settings
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', cast=str, default='test-access-key')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', cast=str, default='test-secret-key')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', cast=str, default='test-bucket')
AWS_S3_CUSTOM_DOMAIN = config('AWS_S3_CUSTOM_DOMAIN', cast=str, default=None)
AWS_S3_FILE_OVERWRITE = config('AWS_S3_FILE_OVERWRITE', cast=bool, default=False)
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', cast=str, default='us-east-1')
AWS_DEFAULT_ACL = config('AWS_DEFAULT_ACL', cast=str, default=None)
AWS_S3_VERITY = config('AWS_S3_VERITY', cast=bool, default=True)


# -------------------------------
# Sentry Settings
# -------------------------------
if not DEBUG:
    SENTRY_DSN = config('SENTRY_DSN', cast=str, default='')
    if SENTRY_DSN:
        import sentry_sdk
        from sentry_sdk.integrations.django import DjangoIntegration
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            send_default_pii=True,
            traces_sample_rate=0.2,
            integrations=[DjangoIntegration()],
            environment='production',
        )

    # Production Security Settings
    SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', cast=bool, default=True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000 # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# -------------------------------
# Security & Hosts
# -------------------------------
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# CORS Settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:3001').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]

CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='http://localhost:3000,http://127.0.0.1:3000').split(',')

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
    
    #Auth
    'allauth',
    'allauth.account',
    'allauth.headless',  
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google', 
    'allauth.socialaccount.providers.facebook', 

    # Local Dynamic Apps
    
    'apps.blog',
    'apps.comments',
    'apps.likes',
    'apps.tags',
    'apps.utils',

    'apps.users',
    # 'apps.users.apps.UsersConfig'
    
]

INSTALLED_APPS += EXTERNAL_APPS
SITE_ID = 1

# -------------------------------
# Middleware
# -------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "allauth.account.middleware.AccountMiddleware",
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

if DEBUG:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
else:
    STORAGES = {
        "default": {"BACKEND": "storages.backends.s3boto3.S3Boto3Storage"},
        "staticfiles": {
            "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
            "OPTIONS": {"location": "static"},
        },
    }

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
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
    'ACCESS_TOKEN_LIFETIME': timedelta(days=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=31),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE' : 'access',
    'AUTH_COOKIE_REFRESH' : 'refresh'
}

SITE_ID = 1
AUTHENTICATION_BACKENDS = ("allauth.account.auth_backends.AuthenticationBackend",)
AUTH_USER_MODEL = "users.CustomUser"

ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = False
ACCOUNT_LOGIN_BY_CODE_ENABLED = False
ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = False
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]


# --- Allauth Headless / Security (Browser BFF Strategy) ---
ALLAUTH_HEADLESS_ONLY = True
ALLAUTH_HEADLESS_ADAPTER = 'apps.users.adapter.CustomHeadlessAdapter'
# This tells allauth to enable the /browser/ endpoints
ALLAUTH_HEADLESS = {
    "CONNECTION": {
        "CLIENTS": ["browser"],
    }
}
# Security / Session Settings
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = False  # Must be False so JS can read for headers
CSRF_COOKIE_SECURE = not DEBUG

# Headless Routing
ALLAUTH_HEADLESS_FRONTEND_URLS = {
    # Existing URLs
    "account_dashboard": "http://localhost:3000/dashboard",
    "account_signup": "http://localhost:3000/auth/signup",
    
    # REQUIRED for Social Auth: Where to go if login fails
    "socialaccount_login_error": "http://localhost:3000/auth/login-error",
    
    # Highly recommended additions for email/password flows
    "account_confirm_email": "http://localhost:3000/auth/verify-email/{key}",
    "account_reset_password_from_key": "http://localhost:3000/auth/password-reset/confirm/{key}",
}

# Social Account Configuration
SOCIALACCOUNT_ADAPTER = 'allauth.socialaccount.adapter.DefaultSocialAccountAdapter'
SOCIALACCOUNT_EMAIL_AUTHENTICATION_AUTO_CONNECT = True
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': config('GOOGLE_CLIENT_ID'),
            'secret': config('GOOGLE_CLIENT_SECRET'),
            'key': ''
        },
        'SCOPE': ['profile', 'email'],
        'AUTH_PARAMS': {'access_type': 'online'},
    },
    'facebook': {
        'METHOD': 'oauth2',
        'SDK_URL': '//connect.facebook.net/{locale}/sdk.js',
        'SCOPE': ['email', 'public_profile'],
        'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
        'APP': {
            'client_id': config("FACEBOOK_APP_ID"),
            'secret': config("FACEBOOK_APP_SECRET"),
            'key': ''
        }
    }
}

# from corsheaders.defaults import default_headers

# CORS_ALLOW_HEADERS = (
#     *default_headers,
#     "x-session-token",
#     "x-email-verification-key",
#     "x-password-reset-key",
# )

# Cloudinary settings
cloudinary.config(
    cloud_name = config("CLOUD_NAME"),
    api_key = config("API_KEY"),
    api_secret = config("API_SECRET"),
    
)

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

from celery.schedules import crontab

# CELERY BEAT SCHEDULE
CELERY_BEAT_SCHEDULE = {
    'weekly-cleanup-all-tmp': {
        'task': 'apps.utils.tasks.purge_old_tmp_files', 
        'schedule': crontab(hour=0, minute=0, day_of_week=1), 
    },
}