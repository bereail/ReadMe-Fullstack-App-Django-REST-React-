from rest_framework import viewsets, permissions
from .models import Lectura
from .serializers import LecturaSerializer

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.usuario == request.user

class LecturaViewSet(viewsets.ModelViewSet):
    serializer_class = LecturaSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Lectura.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
