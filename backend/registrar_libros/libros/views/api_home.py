from django.http import JsonResponse

def api_home(request):
    return JsonResponse({"mensaje": "Bienvenido a la API de Registro de Libros 📚"})
