from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from accounts.permissions import IsStaffUser

from .models import Quotation
from .serializers import QuotationStaffSerializer, QuotationSerializer


class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all()

    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_serializer_class(self):
        if self.action == "create":
            return QuotationSerializer
        return QuotationStaffSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsStaffUser()]