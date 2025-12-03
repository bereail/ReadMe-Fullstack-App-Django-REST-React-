from django.db import models
from django.contrib.auth.models import User

class Libro(models.Model):
    titulo = models.CharField(max_length=255)
    autor = models.CharField(max_length=255)
    anio = models.IntegerField(blank=True, null=True)
    portada = models.URLField(blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.titulo


class Lectura(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lecturas")
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE, related_name="lecturas")

    fecha_inicio = models.DateField(blank=True, null=True)
    fecha_fin = models.DateField(blank=True, null=True)

    lugar_finalizacion = models.CharField(max_length=255, blank=True, null=True)
    puntuacion = models.IntegerField(blank=True, null=True)
    comentario = models.TextField(blank=True, null=True)

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.libro.titulo}"


class Anotacion(models.Model):
    lectura = models.ForeignKey(Lectura, on_delete=models.CASCADE, related_name="anotaciones")
    pagina = models.IntegerField(blank=True, null=True)
    texto = models.TextField()

    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Nota en página {self.pagina} - {self.lectura.libro.titulo}"
