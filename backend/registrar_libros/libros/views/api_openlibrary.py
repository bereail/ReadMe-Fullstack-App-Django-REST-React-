import random
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def libros_home_openlibrary_random(request):
    palabras = ["fiction","science","history","poetry","philosophy","art","mystery","travel"]
    q = random.choice(palabras)
    r = requests.get(f"https://openlibrary.org/search.json?q={q}", timeout=10)
    if r.status_code != 200:
        return JsonResponse({"error":"No se pudo consultar OpenLibrary"}, status=500)
    docs = r.json().get("docs", [])[:40]
    elegidos = random.sample(docs, min(8, len(docs)))

    out = []
    for i, doc in enumerate(elegidos):
        isbn = (doc.get("isbn") or [None])[0]
        cover = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg" if isbn else (
            f"https://covers.openlibrary.org/b/id/{doc.get('cover_i')}-L.jpg" if doc.get('cover_i') else None
        )
        _id = isbn or f"{doc.get('title','sin-titulo')}-{i}"
        out.append({
            "id": str(_id),
            "title": doc.get("title", "Sin título"),
            "author": (doc.get("author_name") or ["Desconocido"])[0],
            "year": doc.get("first_publish_year"),
            "coverUrl": cover,
        })
    return JsonResponse(out, safe=False)

@require_http_methods(["GET"])
def buscar_libros_por_titulo(request):
    titulo = (request.GET.get("titulo") or "").strip()
    if not titulo:
        return JsonResponse({"error": "Falta el parámetro 'titulo'."}, status=400)

    r = requests.get(f"https://openlibrary.org/search.json?title={titulo}", timeout=10)
    if r.status_code != 200:
        return JsonResponse({"error":"No se pudo acceder a OpenLibrary"}, status=500)

    out = []
    for i, libro in enumerate(r.json().get("docs", [])[:15]):
        isbn = (libro.get("isbn") or [None])[0]
        cover = f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg" if isbn else (
            f"https://covers.openlibrary.org/b/id/{libro.get('cover_i')}-L.jpg" if libro.get('cover_i') else None
        )
        _id = isbn or f"{libro.get('title','sin-titulo')}-{i}"
        out.append({
            "id": str(_id),
            "title": libro.get("title", "Sin título"),
            "author": (libro.get("author_name") or ["Desconocido"])[0],
            "year": libro.get("first_publish_year"),
            "coverUrl": cover,
        })
    return JsonResponse(out, safe=False)
