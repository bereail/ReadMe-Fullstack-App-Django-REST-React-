from django.urls import path
from libros.views import (
    api_home,
    libros_home_openlibrary_random,
    buscar_libros_por_titulo,
    guardar_lectura,
    listar_lecturas,
)

urlpatterns = [
    path('', api_home),
    path('libros-inicio', libros_home_openlibrary_random),   # 8 random
    path('buscar-libros', buscar_libros_por_titulo),         # ?titulo=...
    path('lecturas', listar_lecturas),                       # GET
    path('lecturas/guardar', guardar_lectura),               # POST
]



#    path('libros-inicio', libros_home_openlibrary_random),
#    path('registrar-lectura/', registrar_lectura, name='registrar_lectura'),
#    path('guardar-libro/', guardar_libro, name='guardar_libro_post'),
#    path('libros/', listar_libros, name='listar_libros'),
#    path('libro/<int:id>/', obtener_libro_por_id, name='ver_libro_por_id'),
#    path('buscar-libro/<str:isbn>/', buscar_libro_por_isbn, name='buscar_libro_por_isbn'),
#    path('guardar-libro/<str:isbn>/<int:id_usuario>/', guardar_libro_por_isbn, name='guardar_libro'),
#    path('buscar-libros/<str:titulo>/', buscar_libros_por_titulo, name='buscar_libros_por_titulo'),
#    path('libros-leidos', agregar_libro_leido, name='libros_leidos'),
#    path('mis-libros', listar_libros_usuario, name='mis_libros'),
#    path('guardar-lectura/', guardar_lectura, name='guardar_lectura'),
#    path('libros/', listar_libros, name='listar_libros'),
#    path('api/lecturas/', listar_lecturas, name='listar_lecturas'),
#    path('libro/<int:id>/', obtener_libro_por_id, name='obtener_libro_por_id')