"""
Django settings for QLKH_Project - Quản Lý Khách Hàng
Upgraded: API-first architecture with DRF, JWT, PostgreSQL, Redis
"""
from datetime import timedelta
import os
from pathlib import Path

try:
    import dj_database_url
except ModuleNotFoundError:  # pragma: no cover
    dj_database_url = None

try:
    from decouple import config, Csv
except ModuleNotFoundError:  # pragma: no cover
    class Csv:
        def __call__(self, value):
            if not value:
                return []
            return [item.strip() for item in value.split(',') if item.strip()]

    def config(key, default=None, cast=None):
        value = os.getenv(key, default)
        if cast and value is not None:
            try:
                if cast is bool and isinstance(value, str):
                    return value.strip().lower() in {'1', 'true', 'yes', 'on'}
                return cast(value)
            except Exception:
                return default
        return value

BASE_DIR = Path(__file__).resolve().parent.parent


def config_bool(key: str, default: bool) -> bool:
    raw = config(key, default=str(default))
    if isinstance(raw, bool):
        return raw
    value = str(raw).strip().lower()
    if value in {'1', 'true', 'yes', 'on'}:
        return True
    if value in {'0', 'false', 'no', 'off'}:
        return False
    return default

# ─── Core ────────────────────────────────────────────────────────────────────
SECRET_KEY = config('SECRET_KEY', default='django-insecure-qlkh-project-secret-key-change-in-production-2024')
DEBUG = config_bool('DEBUG', default=True)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*', cast=Csv())

# ─── Applications ─────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'drf_spectacular',
    'django_filters',
    # Local apps
    'api',
    'accounts',
    'customers',
    'sentiment',
]

# ─── Middleware ────────────────────────────────────────────────────────────────
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'qlkh_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'qlkh_project.wsgi.application'

# ─── Database ─────────────────────────────────────────────────────────────────
_database_url = config('DATABASE_URL', default='')
if _database_url and dj_database_url:
    DATABASES = {'default': dj_database_url.parse(_database_url, conn_max_age=600)}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'data' / 'django_app.db',
        }
    }

# ─── Cache / Redis ─────────────────────────────────────────────────────────────
REDIS_URL = config('REDIS_URL', default='redis://localhost:6379/0')

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'qlkh-cache',
    }
}
# Uncomment below when Redis is available:
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': REDIS_URL,
#         'OPTIONS': {'CLIENT_CLASS': 'django_redis.client.DefaultClient'},
#     }
# }

# ─── Celery ────────────────────────────────────────────────────────────────────
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/1')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Ho_Chi_Minh'

# ─── Auth ─────────────────────────────────────────────────────────────────────
AUTH_USER_MODEL = 'accounts.User'
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 3}},
]

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/customers/'
LOGOUT_REDIRECT_URL = '/accounts/login/'

# ─── Django REST Framework ─────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',  # for browsable API
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': config('DEFAULT_PAGE_SIZE', default=20, cast=int),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# ─── JWT Settings ──────────────────────────────────────────────────────────────
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=config('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', default=60, cast=int)
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        days=config('JWT_REFRESH_TOKEN_LIFETIME_DAYS', default=7, cast=int)
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'TOKEN_OBTAIN_SERIALIZER': 'api.serializers.CustomTokenObtainPairSerializer',
}

# ─── DRF Spectacular (OpenAPI / Swagger) ───────────────────────────────────────
SPECTACULAR_SETTINGS = {
    'TITLE': 'QLKH API - Quản Lý Khách Hàng',
    'DESCRIPTION': (
        'API-first backend cho hệ thống Quản lý Khách hàng với tích hợp AI.\n\n'
        '**Features:**\n'
        '- 🔐 JWT Authentication\n'
        '- 👥 Customer CRUD với phân quyền RBAC\n'
        '- 🤖 Phân tích cảm xúc (Sentiment Analysis)\n'
        '- 📊 Phân cụm AI (K-means Clustering)\n'
        '- 🔍 Tìm kiếm ngữ nghĩa (Semantic Search)\n'
        '- 📈 Dự báo xu hướng doanh thu'
    ),
    'VERSION': '2.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {
        'deepLinking': True,
        'persistAuthorization': True,
        'displayOperationId': True,
    },
    'COMPONENT_SPLIT_REQUEST': True,
    'SORT_OPERATIONS': False,
}

# ─── Internationalisation ─────────────────────────────────────────────────────
LANGUAGE_CODE = 'vi'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True

# ─── Static files ─────────────────────────────────────────────────────────────
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

# ─── AI / ML Settings ─────────────────────────────────────────────────────────
MAX_CLUSTER_COUNT = config('MAX_CLUSTER_COUNT', default=6, cast=int)
SENTIMENT_CACHE_TIMEOUT = 3600  # 1 hour
