from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    me, RegisterView,
    LibroViewSet, LecturaViewSet, AnotacionViewSet,
    stats_lecturas,
    buscar_libros, libros_por_subject,
    guardar_lectura,
)

router = DefaultRouter()
router.register(r"libros", LibroViewSet, basename="libros")
router.register(r"lecturas", LecturaViewSet, basename="lecturas")
router.register(r"anotaciones", AnotacionViewSet, basename="anotaciones")

urlpatterns = [
    # CRUD
    path("", include(router.urls)),

    # USER
    path("me/", me),
    path("register/", RegisterView.as_view()),

    # STATS
    path("stats/lecturas/", stats_lecturas),

    # ✅ OPENLIBRARY (público)
    path("openlibrary/buscar/", buscar_libros),
    path("openlibrary/subject/<str:subject>/", libros_por_subject),

    # ✅ GUARDAR (logeado)
    path("guardar/", guardar_lectura),
]
