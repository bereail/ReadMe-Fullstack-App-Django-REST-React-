from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Libro, Lectura, Anotacion


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class RegisterSerializer(serializers.ModelSerializer):
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


class LibroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Libro
        fields = "__all__"


class LecturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lectura
        fields = "__all__"


class AnotacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anotacion
        fields = "__all__"
