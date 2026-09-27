from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.permissions import IsManagerOrAbove, get_staff_role

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer

    http_method_names = ["get", "patch", "head", "options"]

    def get_queryset(self):
        return Company.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsManagerOrAbove()]

    def partial_update(self, request, *args, **kwargs):
        if "logo" in request.data and get_staff_role(request.user) != "super_admin":
            return Response(
                {"detail": "Only a Super Admin can change the company logo."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().partial_update(request, *args, **kwargs)