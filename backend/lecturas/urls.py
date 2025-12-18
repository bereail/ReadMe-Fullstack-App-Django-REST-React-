# lecturas/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    me, RegisterView, stats_lecturas,
    guardar_lectura, buscar_libros, libros_por_subject,
    LibroViewSet, LecturaViewSet, AnotacionViewSet
)

router = DefaultRouter()
router.register(r"libros", LibroViewSet, basename="libros")
router.register(r"lecturas", LecturaViewSet, basename="lecturas")
router.register(r"anotaciones", AnotacionViewSet, basename="anotaciones")

urlpatterns = [
    path("", include(router.urls)),

    # user
    path("me/", me),
    path("register/", RegisterView.as_view()),
    path("stats/lecturas/", stats_lecturas),

    # openlibrary (público)
    path("openlibrary/buscar/", buscar_libros),
    path("openlibrary/subject/<str:subject>/", libros_por_subject),

    # guardar (privado)
    path("guardar/", guardar_lectura),
]
