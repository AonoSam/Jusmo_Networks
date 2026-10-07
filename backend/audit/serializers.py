from rest_framework import serializers

from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = (
            "id", "actor_username", "action", "model_name",
            "object_id", "object_repr", "changes",
            "ip_address", "user_agent", "created_at",
        )