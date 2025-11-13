from django.db import models

class Book(models.Model):
    openlibrary_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=300)
    author = models.CharField(max_length=300, blank=True)
    year = models.IntegerField(null=True, blank=True)
    cover_url = models.URLField(blank=True)

    def __str__(self):
        return self.title
