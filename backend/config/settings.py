from pathlib import Path
import os
from datetime import timedelta

from dotenv import load_dotenv
from corsheaders.defaults import default_headers


BASE_DIR = Path(__file__).resolve().parent.parent

# Carga .env solo en local (en Render igual funciona si existe, no molesta)
load_dotenv(BASE_DIR / ".env")


# ------------------------------------------------------------
# Seguridad / entorno
# ------------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "insecure-dev-secret")

# ✅ DEV: por defecto True si lo seteás en .env
# Recomendación: default False (para que nunca se te vaya a prod en True)
DEBUG = os.getenv("DEBUG", "True") == "True"

# ------------------------------------------------------------
# Hosts
# ------------------------------------------------------------
#raw_hosts = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1")
#ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(",") if h.strip()]
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"]



# --------------------------- PRODUCCIÓN (comentado) ---------------------------
# DEBUG = os.getenv("DEBUG", "False") == "True"
# raw_hosts = os.getenv("ALLOWED_HOSTS", "")
# ALLOWED_HOSTS = [h.strip() for h in raw_hosts.split(",") if h.strip()]
# -----------------------------------------------------------------------------


# ------------------------------------------------------------
# Apps
# ------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",

    "lecturas",
]


# ------------------------------------------------------------
# Middleware (orden IMPORTANTE)
# ------------------------------------------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",

    # WhiteNoise (si lo tenés instalado)
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ------------------------------------------------------------
# URLs / Templates / WSGI
# ------------------------------------------------------------
ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ------------------------------------------------------------
# Base de datos (SQLite para dev/demo)
# ------------------------------------------------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# ------------------------------------------------------------
# Password validation
# ------------------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ------------------------------------------------------------
# Internacionalización
# ------------------------------------------------------------
LANGUAGE_CODE = "es-ar"
TIME_ZONE = "America/Argentina/Cordoba"
USE_I18N = True
USE_TZ = True


# ------------------------------------------------------------
# Cache
# ------------------------------------------------------------
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "readme-cache",
    }
}


# ------------------------------------------------------------
# Static files
# ------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# --------------------------- PRODUCCIÓN (comentado) ---------------------------
# WhiteNoise storage recomendado para deploy (cache + compresión)
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# -----------------------------------------------------------------------------


# ------------------------------------------------------------
# CORS / CSRF
# ------------------------------------------------------------
# ✅ DEV (localhost)
CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# --------------------------- PRODUCCIÓN (comentado) ---------------------------
# CORS_ALLOW_ALL_ORIGINS = False
# raw_cors = os.getenv("CORS_ALLOWED_ORIGINS", "")
# CORS_ALLOWED_ORIGINS = [o.strip() for o in raw_cors.split(",") if o.strip()]
#
# raw_csrf = os.getenv("CSRF_TRUSTED_ORIGINS", "")
# CSRF_TRUSTED_ORIGINS = [o.strip() for o in raw_csrf.split(",") if o.strip()]
# -----------------------------------------------------------------------------


# ------------------------------------------------------------
# DRF + JWT
# ------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}


# --------------------------- PRODUCCIÓN (comentado) ---------------------------
# Seguridad extra para HTTPS detrás de proxy (Render/railway/heroku-like)
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# -----------------------------------------------------------------------------


# ------------------------------------------------------------
# Default PK
# ------------------------------------------------------------
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
