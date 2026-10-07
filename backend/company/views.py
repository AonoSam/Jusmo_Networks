from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from accounts.permissions import IsManagerOrAbove, get_staff_role
from audit.mixins import AuditLogMixin

from .models import Company
from .serializers import CompanySerializer


class CompanyViewSet(AuditLogMixin, viewsets.ModelViewSet):
    serializer_class = CompanySerializer

    # Support both JSON requests and multipart/form-data file uploads
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    http_method_names = [
        "get",
        "post",
        "patch",
        "head",
        "options",
    ]

    def get_queryset(self):
        return Company.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]

        return [IsManagerOrAbove()]

    def create(self, request, *args, **kwargs):
        # Only one company record is allowed
        if Company.objects.exists():
            return Response(
                {
                    "detail": (
                        "A company record already exists. "
                        "Edit the existing record instead of creating a new one."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Only Super Admin can change the company logo
        if "logo" in request.data:
            if get_staff_role(request.user) != "super_admin":
                return Response(
                    {
                        "detail": (
                            "Only a Super Admin can change "
                            "the company logo."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        return super().partial_update(request, *args, **kwargs)