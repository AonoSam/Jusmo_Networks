from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from accounts.permissions import IsStaffUser

from .models import Enquiry
from .serializers import EnquiryStaffSerializer, EnquirySerializer


class EnquiryViewSet(viewsets.ModelViewSet):
    queryset = Enquiry.objects.all()

    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_serializer_class(self):
        if self.action == "create":
            return EnquirySerializer
        return EnquiryStaffSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsStaffUser()]