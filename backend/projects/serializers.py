from rest_framework import serializers

from .models import Project, ProjectImage
from services.serializers import ServiceSerializer


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ("id", "image", "caption", "display_order")


class ProjectSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "id", "title", "slug", "description", "category", "location",
            "client_name", "services", "project_date", "status", "featured",
            "is_published", "images", "created_at", "updated_at",
        )
        read_only_fields = ("slug",)


class ProjectWriteSerializer(serializers.ModelSerializer):
    """Used for staff create/update — services accepted as a list of IDs."""

    class Meta:
        model = Project
        fields = (
            "id", "title", "description", "category", "location", "client_name",
            "services", "project_date", "status", "featured", "is_published",
        )