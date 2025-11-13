from rest_framework import serializers
from .models import Reading, Note
from library.serializers import BookSerializer

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class ReadingSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Reading
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]

    def create(self, validated_data):
        book_data = validated_data.pop("book")
        from library.models import Book
        book, _ = Book.objects.get_or_create(
            openlibrary_id=book_data["openlibrary_id"],
            defaults=book_data,
        )
        user = self.context["request"].user
        return Reading.objects.create(user=user, book=book, **validated_data)
