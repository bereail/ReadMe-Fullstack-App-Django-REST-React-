# libros/views/db_libros.py
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import json
from libros.models import Libro, Usuario, Lectura

@csrf_exempt
@require_http_methods(["POST"])
def registrar_lectura(request):
    try:
        data = json.loads(request.body)

        usuario = Usuario.objects.get(id=data["usuario_id"])
        libro = Libro.objects.get(id=data["libro_id"])

        lectura = Lectura.objects.create(
            usuario=usuario,
            libro=libro,
            fecha_inicio=data.get("fecha_inicio"),
            fecha_fin=data.get("fecha_fin"),
            lugar_fin=data.get("lugar_fin"),
            puntaje=data.get("puntaje"),
            comentario=data.get("comentario")
        )

        return JsonResponse({"mensaje": "Lectura registrada", "lectura_id": lectura.id})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from ..models import Libro, Usuario

@csrf_exempt
def agregar_libro_leido(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            usuario = Usuario.objects.get(id_usuario=data["usuario_id"])

            libro = Libro.objects.create(
                titulo=data.get("titulo"),
                autor=data.get("autor"),
                genero=data.get("genero"),
                isbn=data.get("isbn"),
                fecha_inicio=data.get("fecha_inicio"),
                fecha_fin=data.get("fecha_fin"),
                lugar_fin=data.get("lugar_fin"),
                paginas=data.get("paginas"),
                puntaje=data.get("puntaje"),
                comentario=data.get("comentario"),
                imagen_url=data.get("imagen_url"),
                usuario_id=usuario.id_usuario
            )

            return JsonResponse({"mensaje": "Libro leído guardado", "id": libro.id_libro}, status=201)

        except Usuario.DoesNotExist:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)

# 📚 Listar todos los libros guardados en la base de datos
def listar_libros(request):
    try:
        libros = Libro.objects.all()
        data = []

        for libro in libros:
            data.append({
                "id": libro.id,
                "titulo": libro.titulo,
                "autor": libro.autor,
                "paginas": libro.paginas,
                "isbn": libro.isbn,
                "imagen_url": libro.imagen_url,
                "usuario": libro.usuario.nombre if libro.usuario else None
            })

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

# ✨ Vista para ver un libro por ID (desde base de datos)
def obtener_libro_por_id(request, id):
    try:
        libro = Libro.objects.get(id=id)
        data = {
            "id": libro.id,
            "titulo": libro.titulo,
            "autor": libro.autor,
            "imagen_url": libro.imagen_url,
        }
        return JsonResponse(data)
    except Libro.DoesNotExist:
        return JsonResponse({"error": "Libro no encontrado"}, status=404)


def listar_libros_usuario(request):
    usuario_id = request.GET.get("usuario_id")

    if not usuario_id:
        return JsonResponse({"error": "Falta el parámetro usuario_id"}, status=400)

    libros = Libro.objects.filter(usuario_id=usuario_id)
    data = []

    for libro in libros:
        data.append({
            "id": libro.id_libro,
            "titulo": libro.titulo,
            "autor": libro.autor,
            "fecha_inicio": libro.fecha_inicio,
            "fecha_fin": libro.fecha_fin,
            "puntaje": libro.puntaje,
            "comentario": libro.comentario,
            "imagen_url": libro.imagen_url
        })

    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["POST"])
def registrar_lectura(request):
    try:
        data = json.loads(request.body)

        usuario = Usuario.objects.get(id=data["usuario_id"])
        libro = Libro.objects.get(id=data["libro_id"])

        lectura = Lectura.objects.create(
            usuario=usuario,
            libro=libro,
            fecha_inicio=data.get("fecha_inicio"),
            fecha_fin=data.get("fecha_fin"),
            lugar_fin=data.get("lugar_fin"),
            puntaje=data.get("puntaje"),
            comentario=data.get("comentario")
        )

        return JsonResponse({"mensaje": "Lectura registrada", "lectura_id": lectura.id})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
@csrf_exempt
@require_http_methods(["POST"])
def guardar_lectura(request):
    try:
        data = json.loads(request.body)  # 👈 Esto va primero
        print("📥 Datos recibidos:", data)  # 👈 Luego recién podés imprimirlo

        usuario = Usuario.objects.get(id=data["usuario_id"])

        libro, _ = Libro.objects.get_or_create(
            isbn=data.get("isbn") or None,
            defaults={
                "titulo": data.get("titulo"),
                "autor": data.get("autor"),
                "imagen_url": data.get("imagen_url"),
            }
        )

        lectura = Lectura.objects.create(
            usuario=usuario,
            libro=libro,
            fecha_inicio=data.get("fecha_inicio") or None,
            fecha_fin=data.get("fecha_fin") or None,
            lugar_fin=data.get("lugar_fin") or None,
            puntaje=data.get("puntaje") or None,
            comentario=data.get("comentario") or ""
        )

        return JsonResponse({"mensaje": "Lectura registrada con éxito", "lectura_id": lectura.id})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=400)
