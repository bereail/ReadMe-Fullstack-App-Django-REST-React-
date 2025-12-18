import requests
from django.core.cache import cache
from django.contrib.auth.models import User
from django.db.models import Count
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied

from .models import Libro, Lectura, Anotacion
from .serializers import (
    LibroSerializer,
    LecturaSerializer,
    AnotacionSerializer,
    RegisterSerializer,
    UserSerializer,
)


# ============================================================
#  USER / PERFIL
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Devuelve el usuario logeado (perfil básico)."""
    return Response(UserSerializer(request.user).data)


class RegisterView(APIView):
    """Crea un usuario (registro)."""
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


# ============================================================
#  LIBROS (DB) - CRUD
# ============================================================

class LibroViewSet(viewsets.ModelViewSet):
    """
    CRUD del modelo Libro (tu base).
    - GET list/retrieve: público
    - POST/PUT/PATCH/DELETE: solo logeado
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["titulo", "autor"]   # /libros/?search=...
    ordering_fields = ["titulo", "autor", "anio"]
    ordering = ["titulo"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]


# ============================================================
#  LECTURAS (mis lecturas) - CRUD + TOP
# ============================================================

class LecturaViewSet(viewsets.ModelViewSet):
    """
    Mis lecturas del usuario logeado.
    Importante: el queryset filtra por request.user (seguridad).
    """
    serializer_class = LecturaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Lectura.objects
            .filter(usuario=self.request.user)
            .select_related("libro")
        )

    def perform_create(self, serializer):
        # El usuario NO lo manda el cliente. Se asigna desde el token.
        serializer.save(usuario=self.request.user)

    @action(detail=False, methods=["get"], url_path="top")
    def top(self, request):
        """
        GET /lecturas/top/
        Devuelve lecturas con mejor puntuación del usuario.
        """
        qs = (
            self.get_queryset()
            .filter(puntuacion__isnull=False)
            .order_by("-puntuacion", "-actualizado_en")[:20]
        )
        return Response(self.get_serializer(qs, many=True).data)


# ============================================================
#  ANOTACIONES - CRUD
# ============================================================

class AnotacionViewSet(viewsets.ModelViewSet):
    """
    CRUD de anotaciones.
    Seguridad: solo anotaciones de lecturas del usuario logeado.
    """
    serializer_class = AnotacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Anotacion.objects.filter(lectura__usuario=self.request.user)
        lectura_id = self.request.query_params.get("lectura")
        if lectura_id:
            qs = qs.filter(lectura_id=lectura_id)
        return qs

    def perform_create(self, serializer):
        lectura = serializer.validated_data.get("lectura")
        if lectura.usuario != self.request.user:
            raise PermissionDenied("No podés agregar anotaciones a lecturas de otro usuario.")
        serializer.save()


# ============================================================
#  STATS (solo usuario logeado)
# ============================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stats_lecturas(request):
    """
    GET /stats/lecturas/
    Devuelve métricas simples del usuario:
    - total
    - terminados (tienen fecha_fin)
    - leyendo (tienen fecha_inicio pero no fecha_fin)
    """
    usuario = request.user

    total = Lectura.objects.filter(usuario=usuario).count()
    terminados = Lectura.objects.filter(usuario=usuario, fecha_fin__isnull=False).count()
    leyendo = Lectura.objects.filter(
        usuario=usuario,
        fecha_inicio__isnull=False,
        fecha_fin__isnull=True
    ).count()

    return Response({"total": total, "terminados": terminados, "leyendo": leyendo})


# ============================================================
#  OPENLIBRARY (público) - proxy
# ============================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def buscar_libros(request):
    """
    GET /openlibrary/buscar/?q=harry
    Proxy a OpenLibrary search.
    Devuelve un shape simple y consistente para el front.
    """
    query = request.GET.get("q", "the").strip()
    url = "https://openlibrary.org/search.json"
    params = {"q": query}

    try:
        r = requests.get(url, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException as e:
        return Response(
            {"error": "OpenLibrary request failed", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    except ValueError as e:
        return Response(
            {"error": "OpenLibrary invalid JSON", "detail": str(e), "raw": r.text[:200]},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    resultados = []
    for item in data.get("docs", [])[:8]:
        cover_id = item.get("cover_i")
        portada = (
            f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
            if cover_id
            else None
        )

        resultados.append(
            {
                "titulo": item.get("title"),
                "autor": (item.get("author_name") or ["Desconocido"])[0],
                "anio": item.get("first_publish_year"),
                "cover_id": cover_id,
                "portada": portada,      # ✅ CONSISTENTE
                "cover_url": portada,    # opcional (por compatibilidad)
                "openlibrary_id": item.get("key"),
            }
        )

    return Response(resultados, status=status.HTTP_200_OK)




# ============================================================
# ENDPOINT GENERICO PARA BUSQUEDAS POR SUBJECT
# ============================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def libros_por_subject(request, subject):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 5))
    offset = (page - 1) * limit

    cache_key = f"subject:{subject}:page:{page}:limit:{limit}"
    cached = cache.get(cache_key)
    if cached:
        return Response(cached, status=status.HTTP_200_OK)

    url = "https://openlibrary.org/subjects/%s.json" % subject
    params = {"limit": limit, "offset": offset}

    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException as e:
        return Response({"error": "OpenLibrary request failed", "detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

    works = data.get("works", []) or []

    resultados = []
    for item in works:
        cover_id = item.get("cover_id")
        portada = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None
        resultados.append({
            "titulo": item.get("title"),
            "autor": (item.get("authors") or [{}])[0].get("name") or "Desconocido",
            "anio": item.get("first_publish_year"),
            "portada": portada,
        })

    payload = {
        "results": resultados,
        "page": page,
        "limit": limit,
        "has_more": len(works) == limit,  # si devolvió lleno, probablemente hay más
    }

    cache.set(cache_key, payload, 60 * 10)  # 10 min
    return Response(payload, status=status.HTTP_200_OK)



# ============================================================
#  GUARDAR (solo logeado)
#  - Crea/obtiene Libro en DB
#  - Crea Lectura asociada al usuario
#  - Devuelve LECTURA serializada (shape consistente)
# ============================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def guardar_lectura(request):
    """
    POST /guardar/
    Body esperado (mínimo):
      { "titulo": "...", "autor": "...", "anio": 2003, "portada": "...", "descripcion": "..." }

    Opcional:
      fecha_inicio, fecha_fin, lugar_finalizacion, puntuacion, comentario

    Importante:
    - Deduplicamos Libro por (titulo, autor)
    - Evitamos duplicar Lectura del mismo usuario para el mismo libro
    """
    data = request.data

    titulo = data.get("titulo")
    if not titulo:
        return Response({"detail": "Falta título"}, status=status.HTTP_400_BAD_REQUEST)

    autor = data.get("autor") or "Desconocido"
    anio = data.get("anio")
    portada = data.get("portada") or data.get("cover_url")
    descripcion = data.get("descripcion")

    libro, _ = Libro.objects.get_or_create(
        titulo=titulo,
        autor=autor,
        defaults={
            "anio": anio,
            "portada": portada,
            "descripcion": descripcion,
        },
    )

    if Lectura.objects.filter(usuario=request.user, libro=libro).exists():
        return Response({"detail": "Ya tenés esta lectura guardada."}, status=status.HTTP_400_BAD_REQUEST)

    lectura = Lectura.objects.create(
        usuario=request.user,
        libro=libro,
        fecha_inicio=data.get("fecha_inicio") or None,
        fecha_fin=data.get("fecha_fin") or None,
        lugar_finalizacion=data.get("lugar_finalizacion") or data.get("lugar") or None,
        puntuacion=data.get("puntuacion") if data.get("puntuacion") is not None else data.get("puntaje"),
        comentario=data.get("comentario") or None,
    )

    # ✅ devolvemos el serializer completo (consistencia total con el front)
    return Response(LecturaSerializer(lectura).data, status=status.HTTP_201_CREATED)



# ============================================================
# LIBROS POPULARES
#
#
#@api_view(["GET"])
#@permission_classes([AllowAny])
#def libros_populares(request):
#    CACHE_KEY = "openlibrary_populares"
#    CACHE_LAST_KEY = "openlibrary_populares_last_good"
#    CACHE_TTL = 60 * 10
#    LAST_GOOD_TTL = 60 * 60 * 24

#    cached = cache.get(CACHE_KEY)
#    if cached:
#        print("✅ POPULARES cache HIT")
#        return Response(cached, status=status.HTTP_200_OK)

#    print("❌ POPULARES cache MISS (llamando OpenLibrary)")
#    url = "https://openlibrary.org/trending/now.json"

#    try:
#        r = requests.get(url, timeout=15)  # 👈 subilo a 15
#        r.raise_for_status()
#        data = r.json()

#        resultados = []
#        for item in data.get("works", [])[:5]:
#            cover_id = item.get("cover_id") or item.get("cover_i")
#            portada = f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None
#            resultados.append({
#                "titulo": item.get("title"),
#                "autor": (item.get("author_name") or ["Desconocido"])[0],
#                "anio": item.get("first_publish_year"),
#                "portada": portada,
#            })

#        cache.set(CACHE_KEY, resultados, CACHE_TTL)
#        cache.set(CACHE_LAST_KEY, resultados, LAST_GOOD_TTL)
#        return Response(resultados, status=status.HTTP_200_OK)

#    except Exception as e:
#        print("⚠️ POPULARES fallo OpenLibrary:", str(e))

#        last_good = cache.get(CACHE_LAST_KEY)
#        if last_good:
#            print("🟡 Devolviendo POPULARES last_good")
#            return Response(last_good, status=status.HTTP_200_OK)

#        return Response([], status=status.HTTP_200_OK)
