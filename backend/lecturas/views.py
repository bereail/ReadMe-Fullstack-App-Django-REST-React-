from django.contrib.auth.models import User
from django.db.models import Count, Q

from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

import requests

from .models import Libro, Lectura, Anotacion
from .serializers import (
    LibroSerializer,
    LecturaSerializer,
    AnotacionSerializer,
    RegisterSerializer,
    UserSerializer,
)


# --------- USER / PERFIL ---------

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "Usuario creado correctamente", "user_id": user.id},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------- LIBROS / LECTURAS / ANOTACIONES (CRUD) ---------

class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["titulo", "autor"]   # ?search=
    ordering_fields = ["titulo"]          # podés agregar "anio" si está en el modelo
    ordering = ["titulo"]                 # orden por defecto


class LecturaViewSet(viewsets.ModelViewSet):
    serializer_class = LecturaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo las lecturas del usuario logueado
        return Lectura.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        # Fuerza que la lectura pertenezca al usuario logueado
        serializer.save(usuario=self.request.user)


class AnotacionViewSet(viewsets.ModelViewSet):
    serializer_class = AnotacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtra anotaciones solo de lecturas del usuario
        return Anotacion.objects.filter(lectura__usuario=self.request.user)


# --------- STATS ---------

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def stats_lecturas(request):
    usuario = request.user

    total = Lectura.objects.filter(usuario=usuario).count()
    terminados = Lectura.objects.filter(
        usuario=usuario,
        fecha_fin__isnull=False,
    ).count()
    leyendo = Lectura.objects.filter(
        usuario=usuario,
        fecha_fin__isnull=True,
        fecha_inicio__isnull=False,
    ).count()

    return Response({
        "total": total,
        "terminados": terminados,
        "leyendo": leyendo,
    })


# --------- OPENLIBRARY + GUARDAR LIBRO ---------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def buscar_libros(request):
    # parámetro de búsqueda, con default "the" si viene vacío
    query = request.GET.get("q", "the")

    url = f"https://openlibrary.org/search.json?q={query}"

    response = requests.get(url)
    data = response.json()

    libros = []

    # Limito a 20 resultados para no traer miles
    for item in data.get("docs", [])[:20]:
        cover_id = item.get("cover_i")

        libros.append({
            "titulo": item.get("title"),
            "autor": item.get("author_name", ["Desconocido"])[0],
            "anio": item.get("first_publish_year"),
            "cover_id": cover_id,
            "cover_url": (
                f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                if cover_id else None
            ),
        })

    return Response(libros)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def guardar_libro(request):
    user = request.user
    data = request.data

    # Validación mínima
    if "titulo" not in data or "autor" not in data:
        return Response(
            {"error": "Faltan campos obligatorios (titulo, autor)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    libro, creado = Libro.objects.get_or_create(
        titulo=data["titulo"],
        autor=data["autor"],
    )

    lectura = Lectura.objects.create(
        usuario=user,
        libro=libro,
        fecha_inicio=data.get("fecha_inicio", None),
        fecha_fin=data.get("fecha_fin", None),
        lugar_lectura=data.get("lugar_lectura", ""),
        puntaje=data.get("puntaje", None),
        comentario=data.get("comentario", ""),
    )

    return Response({
        "mensaje": "Libro guardado exitosamente",
        "libro_id": libro.id,
        "lectura_id": lectura.id,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_lecturas(request):
    user = request.user
    lecturas = Lectura.objects.filter(usuario=user)

    data = []

    for l in lecturas:
        data.append({
            "lectura_id": l.id,
            "titulo": l.libro.titulo,
            "autor": l.libro.autor,
            "fecha_inicio": l.fecha_inicio,
            "fecha_fin": l.fecha_fin,
        })

    return Response(data)

#----------------- TRAER LIBROS POPULARES
@api_view(["GET"])
@permission_classes([AllowAny])

def libros_populares(request):
    url = "https://openlibrary.org/trending/now.json"

    r = requests.get(url)
    data = r.json()

    resultados = []

    # En "works" vienen las obras más populares
    for item in data.get("works", [])[:20]:  # Limito a 20
        cover_id = item.get("cover_id")

        resultados.append({
            "titulo": item.get("title"),
            "autor": item.get("author_name", ["Desconocido"])[0] if item.get("author_name") else "Desconocido",
            "anio": item.get("first_publish_year"),
            "cover_id": cover_id,
            "cover_url": (
                f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                if cover_id else None
            ),
        })

    return Response(resultados)
