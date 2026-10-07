from rest_framework import viewsets

from accounts.permissions import IsSuperAdmin

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = (IsSuperAdmin,)

    def get_queryset(self):
        queryset = AuditLog.objects.all()

        action = self.request.query_params.get("action")
        model_name = self.request.query_params.get("model")

        if action:
            queryset = queryset.filter(action=action)
        if model_name:
            queryset = queryset.filter(model_name__iexact=model_name)

        return queryset[:200]  # cap to keep this fast — see pagination note below