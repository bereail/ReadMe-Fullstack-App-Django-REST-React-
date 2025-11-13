from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reading.views import ReadingViewSet, NoteViewSet
from library.views import BookViewSet

router = DefaultRouter()
router.register("readings", ReadingViewSet, basename="reading")
router.register("notes", NoteViewSet, basename="note")
router.register("books", BookViewSet, basename="book")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/auth/", include("accounts.urls")),
]
