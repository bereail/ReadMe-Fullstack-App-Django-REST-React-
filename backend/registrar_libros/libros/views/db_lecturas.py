import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import get_user_model
from ..models import Libro, Lectura

User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def guardar_lectura(request):
    """
    Crea una Lectura para el usuario autenticado.
    Espera JSON con al menos: { "libro_id": <int> }.
    Opcionales: fecha_inicio, fecha_fin, lugar_fin, puntaje, comentario, status
    """
    try:
        # Si aún no configuraste JWT/Session y querés probar rápido:
        user = request.user if request.user.is_authenticated else User.objects.first()
        if not user:
            return JsonResponse({"error":"No hay usuario autenticado ni usuario de prueba"}, status=401)

        data = json.loads(request.body or "{}")

        # libro: si viene id, lo tomamos; si no, creamos uno “rápido” con lo que haya
        libro = None
        libro_id = data.get("libro_id")
        if libro_id:
            libro = Libro.objects.get(pk=libro_id)
        else:
            # Crear el libro si vino info básica (para pruebas)
            titulo = data.get("titulo")
            if not titulo:
                return JsonResponse({"error":"Falta 'libro_id' o 'titulo' para crear el Libro"}, status=400)
            libro = Libro.objects.create(
                titulo=titulo,
                autor=data.get("autor"),
                isbn=data.get("isbn"),
                imagen_url=data.get("imagen_url"),
                openlibrary_id=data.get("openlibrary_id"),
                paginas=data.get("paginas"),
            )

        lectura = Lectura.objects.create(
            usuario=user,
            libro=libro,
            status=data.get("status") or Lectura.Status.PLANNED,
            fecha_inicio=data.get("fecha_inicio") or None,
            fecha_fin=data.get("fecha_fin") or None,
            lugar_fin=data.get("lugar_fin") or None,
            puntaje=data.get("puntaje") or None,
            comentario=data.get("comentario") or "",
        )

        return JsonResponse({"mensaje":"Lectura registrada", "lectura_id": lectura.id}, status=201)

    except Libro.DoesNotExist:
        return JsonResponse({"error":"Libro no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@require_http_methods(["GET"])
def listar_lecturas(request):
    # del usuario autenticado (o el primero, si aún no hay auth configurada)
    user = request.user if request.user.is_authenticated else User.objects.first()
    if not user:
        return JsonResponse([], safe=False)

    lecturas = (Lectura.objects
                .select_related("libro")
                .filter(usuario=user)
                .order_by("-created_at"))

    data = []
    for l in lecturas:
        libro = l.libro
        data.append({
            "id": l.id,
            "status": l.status,
            "fecha_inicio": l.fecha_inicio,
            "fecha_fin": l.fecha_fin,
            "lugar_fin": l.lugar_fin,
            "puntaje": l.puntaje,
            "comentario": l.comentario,
            "libro": {
                "id": libro.id,
                "titulo": libro.titulo,
                "autor": libro.autor,
                "isbn": libro.isbn,
                "imagen_url": libro.imagen_url
            } if libro else None
        })
    return JsonResponse(data, safe=False)
