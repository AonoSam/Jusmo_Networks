from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from accounts.permissions import IsManagerOrAbove

from .models import Testimonial
from .serializers import TestimonialSerializer
from audit.mixins import AuditLogMixin


class TestimonialViewSet(AuditLogMixin, viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer

    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        is_staff_request = bool(self.request.user and self.request.user.is_authenticated)

        queryset = Testimonial.objects.all().order_by("display_order", "-created_at")

        if not is_staff_request:
            queryset = queryset.filter(is_published=True)

        return queryset

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsManagerOrAbove()]