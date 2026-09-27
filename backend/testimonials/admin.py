from django.contrib import admin

from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "company_name",
        "role",
        "rating",
        "is_published",
        "display_order",
        "created_at",
    )

    list_filter = (
        "is_published",
        "rating",
    )

    search_fields = (
        "name",
        "company_name",
        "role",
        "content",
    )

    list_editable = (
        "is_published",
        "display_order",
    )

    ordering = (
        "display_order",
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )
