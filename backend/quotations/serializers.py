from rest_framework import serializers

from .models import Quotation


class QuotationSerializer(serializers.ModelSerializer):
    """Used for public submission (POST)."""

    class Meta:
        model = Quotation
        fields = (
            "id",
            "client_name",
            "company_name",
            "phone",
            "email",
            "location",
            "service",
            "project_description",
            "preferred_project_date",
            "budget_range",
            "additional_comments",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")


class QuotationStaffSerializer(serializers.ModelSerializer):
    """Used for staff list/retrieve/update — status is writable."""

    service_name = serializers.CharField(source="service.name", read_only=True)

    class Meta:
        model = Quotation
        fields = (
            "id",
            "client_name",
            "company_name",
            "phone",
            "email",
            "location",
            "service",
            "service_name",
            "project_description",
            "preferred_project_date",
            "budget_range",
            "additional_comments",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id", "client_name", "company_name", "phone", "email", "location",
            "service", "project_description", "preferred_project_date",
            "budget_range", "additional_comments", "created_at", "updated_at",
        )