from django.db import models
from django.contrib.auth import get_user_model
from library.models import Book

User = get_user_model()

class Reading(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="readings")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="readings")
    started_at = models.DateField(null=True, blank=True)
    finished_at = models.DateField(null=True, blank=True)
    place = models.CharField(max_length=200, blank=True)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} - {self.book}"


class Note(models.Model):
    reading = models.ForeignKey(Reading, on_delete=models.CASCADE, related_name="notes")
    page = models.IntegerField(null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Note for {self.reading} (page {self.page})"
