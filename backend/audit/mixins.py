from .utils import log_action


class AuditLogMixin:
    """
    Add to any ModelViewSet to automatically log create/update/delete.
    Captures a snapshot of changed fields on update by diffing validated_data
    against the instance's pre-save state.
    """

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request, "create", instance=instance)

    def perform_update(self, serializer):
        instance = serializer.instance
        before = {
            field: getattr(instance, field, None)
            for field in serializer.validated_data.keys()
        }

        updated_instance = serializer.save()

        after = {
            field: getattr(updated_instance, field, None)
            for field in serializer.validated_data.keys()
        }

        changes = {
            field: {"before": str(before[field]), "after": str(after[field])}
            for field in before
            if str(before[field]) != str(after[field]) and field != "password"
        }

        log_action(self.request, "update", instance=updated_instance, changes=changes or None)

    def perform_destroy(self, instance):
        log_action(self.request, "delete", instance=instance)
        instance.delete()