from django.contrib import admin
from .models import Libro, Lectura, Anotacion, Bookmark

@admin.register(Libro)
class LibroAdmin(admin.ModelAdmin):
    list_display = ("titulo", "autor", "isbn", "openlibrary_id", "created_at")
    search_fields = ("titulo", "autor", "isbn", "openlibrary_id")
    list_filter = ("autor",)

@admin.register(Lectura)
class LecturaAdmin(admin.ModelAdmin):
    list_display = ("usuario", "libro", "status", "fecha_inicio", "fecha_fin", "puntaje", "created_at")
    list_filter = ("status", "puntaje")
    search_fields = ("usuario__username", "libro__titulo")

@admin.register(Anotacion)
class AnotacionAdmin(admin.ModelAdmin):
    list_display = ("lectura", "pagina", "created_at")
    search_fields = ("lectura__libro__titulo", "texto")

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("usuario", "libro", "created_at")
    search_fields = ("usuario__username", "libro__titulo")
