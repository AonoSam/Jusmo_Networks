from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from accounts.permissions import IsManagerOrAbove

from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    lookup_field = "slug"

    def get_queryset(self):
        if self.action in ("list", "retrieve") and not (
            self.request.user and self.request.user.is_authenticated
        ):
            return Service.objects.filter(is_active=True)
        return Service.objects.all()

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsManagerOrAbove()]