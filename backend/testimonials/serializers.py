from rest_framework import serializers

from .models import Testimonial


class TestimonialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Testimonial

        fields = (
            "id",
            "name",
            "company_name",
            "role",
            "content",
            "rating",
            "image",
            "is_published",
            "display_order",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )
