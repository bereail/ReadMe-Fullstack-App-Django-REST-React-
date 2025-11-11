# models.py
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Q

class Libro(models.Model):
    # Podés sumar un ID de OpenLibrary si lo estás usando
    openlibrary_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)

    titulo = models.CharField(max_length=255)
    autor = models.CharField(max_length=255, blank=True, null=True)
    genero = models.CharField(max_length=100, blank=True, null=True)
    isbn = models.CharField(max_length=20, blank=True, null=True, db_index=True)
    paginas = models.PositiveIntegerField(blank=True, null=True)
    imagen_url = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["titulo"]),
            models.Index(fields=["autor"]),
        ]

    def __str__(self):
        return self.titulo


class Lectura(models.Model):
    class Status(models.TextChoices):
        PLANNED = "PLANNED", "Planeado"
        READING = "READING", "Leyendo"
        FINISHED = "FINISHED", "Terminado"
        ABANDONED = "ABANDONED", "Abandonado"

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="lecturas",
    )
    libro = models.ForeignKey(
        Libro,
        on_delete=models.CASCADE,
        related_name="lecturas",
    )

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.PLANNED,
        db_index=True,
    )

    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    puntaje = models.PositiveSmallIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    lugar_fin = models.CharField(max_length=100, null=True, blank=True)
    comentario = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        # Si no querés permitir dos lecturas "activas" del mismo libro por usuario:
        # (activa = no terminada)
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "libro", "status"],
                condition=Q(status__in=["PLANNED", "READING"]),
                name="unique_active_read_per_user_book",
            ),
            models.CheckConstraint(
                check=Q(fecha_fin__gte=models.F("fecha_inicio")) | Q(fecha_fin__isnull=True) | Q(fecha_inicio__isnull=True),
                name="end_date_after_start_date",
            ),
        ]

    def __str__(self):
        return f"{self.usuario} - {self.libro} ({self.status})"


class Anotacion(models.Model):
    lectura = models.ForeignKey(
        Lectura,
        on_delete=models.CASCADE,
        related_name="anotaciones",
        null=True,      # ← agregar
        blank=True,     # ← agregar
    )
    pagina = models.PositiveIntegerField(null=True, blank=True)
    texto = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        suf = f"pág. {self.pagina}" if self.pagina else "sin pág."
        return f"Anotación {suf} - {self.lectura.libro.titulo}"


class Bookmark(models.Model):
    """Guardados/Favoritos (opcional si sincronizás el 'Guardar para después')."""
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookmarks",
    )
    libro = models.ForeignKey(
        Libro,
        on_delete=models.CASCADE,
        related_name="bookmarks",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("usuario", "libro")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.usuario} guardó {self.libro}"
