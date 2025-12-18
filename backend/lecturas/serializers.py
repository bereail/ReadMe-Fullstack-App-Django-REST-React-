from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Libro, Lectura, Anotacion


# =========================
#  USER / AUTH
# =========================
class UserSerializer(serializers.ModelSerializer):
    """Devuelve datos públicos del usuario logeado."""
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegisterSerializer(serializers.ModelSerializer):
    """Registro de usuario (crea user con password hasheada)."""
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


# =========================
#  LIBRO
# =========================
class LibroSerializer(serializers.ModelSerializer):
    """Serializer del modelo Libro (tu DB)."""
    class Meta:
        model = Libro
        fields = ["id", "titulo", "autor", "anio", "portada", "descripcion"]


# =========================
#  LECTURA
# =========================
class LecturaSerializer(serializers.ModelSerializer):
    """
    - GET: devuelve libro anidado completo (libro: { ... })
    - POST/PATCH: el cliente manda libro_id (no manda usuario)
    """
    usuario = UserSerializer(read_only=True)

    libro = LibroSerializer(read_only=True)

    libro_id = serializers.PrimaryKeyRelatedField(
        source="libro",
        queryset=Libro.objects.all(),
        write_only=True
    )

    class Meta:
        model = Lectura
        fields = [
            "id",
            "usuario",
            "libro",
            "libro_id",
            "fecha_inicio",
            "fecha_fin",
            "lugar_finalizacion",
            "puntuacion",
            "comentario",
            "creado_en",
            "actualizado_en",
        ]


# =========================
#  ANOTACION
# =========================
class AnotacionSerializer(serializers.ModelSerializer):
    """Notas por lectura. lectura pertenece al usuario."""
    class Meta:
        model = Anotacion
        fields = "__all__"
