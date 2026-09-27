from django.contrib import admin

from .models import Quotation


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):

    list_display = (
        "client_name",
        "company_name",
        "service",
        "phone",
        "email",
        "status",
        "preferred_project_date",
        "created_at",
    )

    list_filter = (
        "status",
        "service",
        "preferred_project_date",
        "created_at",
    )

    search_fields = (
        "client_name",
        "company_name",
        "phone",
        "email",
        "location",
        "project_description",
    )

    autocomplete_fields = (
        "service",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 25
