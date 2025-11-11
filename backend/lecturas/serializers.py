from rest_framework import serializers
from .models import Lectura

class LecturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = "__all__"
        read_only_fields = ("usuario","created_at")
