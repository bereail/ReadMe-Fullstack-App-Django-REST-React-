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
@permission_classes([AllowAny])

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
@permission_classes([AllowAny])
def buscar_libros(request):
    query = request.GET.get("q", "the")
    url = f"https://openlibrary.org/search.json?q={query}"

    response = requests.get(url)
    data = response.json()

    libros = []

    for item in data.get("docs", [])[:20]:
        cover_id = item.get("cover_i")
        openlibrary_id = item.get("key")  # <-- CLAVE

        libros.append({
            "titulo": item.get("title"),
            "autor": item.get("author_name", ["Desconocido"])[0],
            "anio": item.get("first_publish_year"),
            "cover_id": cover_id,
            "cover_url": (
                f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                if cover_id else None
            ),
            "openlibrary_id": openlibrary_id,  # <-- LO ENVIAMOS AL FRONT
        })

    return Response(libros)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def guardar_libro(request):
    data = request.data

    titulo = data.get("titulo")
    autor = data.get("autor")
    anio = data.get("anio")
    cover_url = data.get("cover_url")
    openlibrary_id = data.get("openlibrary_id")

    if not titulo:
        return Response({"detail": "Falta título"}, status=status.HTTP_400_BAD_REQUEST)

    if openlibrary_id:
        # Identificamos por openlibrary_id
        libro, created = Libro.objects.get_or_create(
            openlibrary_id=openlibrary_id,
            defaults={
                "titulo": titulo,
                "autor": autor,
                "anio": anio,
                "cover_url": cover_url,
            },
        )
    else:
        # Fallback: identificamos por título + autor
        libro, created = Libro.objects.get_or_create(
            titulo=titulo,
            autor=autor,
            defaults={
                "anio": anio,
                "cover_url": cover_url,
                "openlibrary_id": None,
            },
        )

    lectura = Lectura.objects.create(
        usuario=request.user,
        libro=libro,
        fecha_inicio=data.get("fecha_inicio") or None,
        fecha_fin=data.get("fecha_fin") or None,
        lugar=data.get("lugar") or "",
        puntaje=data.get("puntaje"),
        comentario=data.get("comentario") or "",
    )

    return Response(
        {
            "id": lectura.id,
            "libro": libro.id,
            "titulo": libro.titulo,
            "autor": libro.autor,
        },
        status=status.HTTP_201_CREATED,
    )

    # 2) Crear lectura
    lectura = Lectura.objects.create(
        usuario=request.user,
        libro=libro,
        fecha_inicio=data.get("fecha_inicio") or None,
        fecha_fin=data.get("fecha_fin") or None,
        lugar=data.get("lugar") or "",
        puntaje=data.get("puntaje"),
        comentario=data.get("comentario") or "",
    )

    return Response(
        {
            "id": lectura.id,
            "libro": libro.id,
            "titulo": libro.titulo,
            "autor": libro.autor,
        },
        status=status.HTTP_201_CREATED,
    )

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
