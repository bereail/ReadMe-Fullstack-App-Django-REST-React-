from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    LibroViewSet,
    LecturaViewSet,
    AnotacionViewSet,
    RegisterView,
    buscar_libros,
    guardar_libro,
    mis_lecturas,
    me,
    stats_lecturas,
    libros_populares
)

router = DefaultRouter()
router.register(r"libros", LibroViewSet, basename="libro")
router.register(r"lecturas", LecturaViewSet, basename="lectura")
router.register(r"anotaciones", AnotacionViewSet, basename="anotacion")

urlpatterns = [
    path("registro/", RegisterView.as_view(), name="registro"),
    path("me/", me, name="me"),
    path("stats/", stats_lecturas, name="stats_lecturas"),
    path("buscar-libros/", buscar_libros, name="buscar_libros"),
    path("guardar-libro/", guardar_libro, name="guardar_libro"),
    path("mis-lecturas/", mis_lecturas, name="mis_lecturas"),
    path("libros-populares/", libros_populares, name="libros_populares"),
]

urlpatterns += router.urls
