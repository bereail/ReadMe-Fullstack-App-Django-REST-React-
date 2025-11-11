from django.contrib import admin
from .models import Lectura

@admin.register(Lectura)
class LecturaAdmin(admin.ModelAdmin):
    list_display = ("id","titulo","usuario","inicio","fin","rating","created_at")
    search_fields = ("titulo","autor","usuario__username")
