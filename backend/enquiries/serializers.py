from rest_framework import serializers

from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    """Used for public submission (POST)."""

    class Meta:
        model = Enquiry
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "subject",
            "message",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")


class EnquiryStaffSerializer(serializers.ModelSerializer):
    """Used for staff list/retrieve/update — status is writable."""

    class Meta:
        model = Enquiry
        fields = (
            "id",
            "name",
            "phone",
            "email",
            "subject",
            "message",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "name", "phone", "email", "subject", "message", "created_at", "updated_at")