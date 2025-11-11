from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LecturaViewSet

router = DefaultRouter()
router.register(r'lecturas', LecturaViewSet, basename='lectura')

urlpatterns = [
    path('', include(router.urls)),
]
