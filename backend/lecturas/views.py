from django.contrib.auth.models import User
from django.db.models import Count, Q
from rest_framework.exceptions import PermissionDenied
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
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

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

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["titulo", "autor"]   # ?search=
    ordering_fields = ["titulo"]
    ordering = ["titulo"]

    # 👇 Ver (list/retrieve) público. Modificar (create/update/delete) solo logeado.
    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]


class LecturaViewSet(viewsets.ModelViewSet):
    serializer_class = LecturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lectura.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)



class AnotacionViewSet(viewsets.ModelViewSet):
    serializer_class = AnotacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Anotacion.objects.filter(
            lectura__usuario=self.request.user
        )

    def perform_create(self, serializer):
        lectura = serializer.validated_data.get("lectura")

        if lectura.usuario != self.request.user:
            raise PermissionDenied(
                "No podés agregar anotaciones a lecturas de otro usuario."
            )

        serializer.save()


# --------- STATS (solo usuario logeado) ---------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
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


# --------- OPENLIBRARY (público) ---------

@api_view(["GET"])
@permission_classes([AllowAny])
def buscar_libros(request):
    query = request.GET.get("q", "the").strip()
    url = f"https://openlibrary.org/search.json?q={query}"

    response = requests.get(url, timeout=15)
    data = response.json()

    libros = []

    for item in data.get("docs", [])[:20]:
        cover_id = item.get("cover_i")
        openlibrary_id = item.get("key")  # Ej: "/works/OL12345W"

        libros.append({
            "titulo": item.get("title"),
            "autor": item.get("author_name", ["Desconocido"])[0] if item.get("author_name") else "Desconocido",
            "anio": item.get("first_publish_year"),
            "cover_id": cover_id,
            "cover_url": (
                f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
                if cover_id else None
            ),
            "openlibrary_id": openlibrary_id,
        })

    return Response(libros)


@api_view(["GET"])
@permission_classes([AllowAny])
def libros_populares(request):
    url = "https://openlibrary.org/trending/now.json"

    r = requests.get(url, timeout=15)
    data = r.json()

    resultados = []

    for item in data.get("works", [])[:20]:
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
            "openlibrary_id": item.get("key"),  # a veces viene también
        })

    return Response(resultados)


# --------- GUARDAR LIBRO + CREAR LECTURA (solo logeado) ---------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def guardar_libro(request):
    data = request.data

    titulo = data.get("titulo")
    autor = data.get("autor") or "Desconocido"
    anio = data.get("anio")
    portada = data.get("cover_url") or data.get("portada")  # acepta ambos
    descripcion = data.get("descripcion")

    if not titulo:
        return Response({"detail": "Falta título"}, status=status.HTTP_400_BAD_REQUEST)

    # 🔥 Sin openlibrary_id en tu modelo: deduplicamos por titulo+autor
    libro, _ = Libro.objects.get_or_create(
        titulo=titulo,
        autor=autor,
        defaults={
            "anio": anio,
            "portada": portada,
            "descripcion": descripcion,
        },
    )

    # Evitar duplicar lectura (opcional pero muy recomendado)
    if Lectura.objects.filter(usuario=request.user, libro=libro).exists():
        return Response({"detail": "Ya tenés esta lectura guardada."}, status=status.HTTP_400_BAD_REQUEST)

    lectura = Lectura.objects.create(
        usuario=request.user,
        libro=libro,
        fecha_inicio=data.get("fecha_inicio") or None,
        fecha_fin=data.get("fecha_fin") or None,
        lugar_finalizacion=data.get("lugar") or data.get("lugar_finalizacion") or None,
        puntuacion=data.get("puntaje") if data.get("puntaje") is not None else data.get("puntuacion"),
        comentario=data.get("comentario") or None,
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

# --------- MIS LECTURAS (solo logeado) ---------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mis_lecturas(request):
    lecturas = Lectura.objects.filter(usuario=request.user).select_related("libro")

    data = []
    for l in lecturas:
        data.append({
            "lectura_id": l.id,
            "titulo": l.libro.titulo,
            "autor": l.libro.autor,
            "fecha_inicio": l.fecha_inicio,
            "fecha_fin": l.fecha_fin,
            "portada": l.libro.portada,
        })

    return Response(data)
