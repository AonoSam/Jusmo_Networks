from django.contrib import admin

from .models import Project, ProjectImage


class ProjectImageInline(
    admin.TabularInline
):
    model = ProjectImage

    extra = 1

    fields = (
        "image",
        "caption",
        "display_order",
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "location",
        "status",
        "featured",
        "is_published",
        "project_date",
    )

    list_filter = (
        "status",
        "featured",
        "is_published",
        "category",
    )

    search_fields = (
        "title",
        "description",
        "category",
        "location",
        "client_name",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }

    list_editable = (
        "featured",
        "is_published",
    )

    ordering = (
        "-project_date",
        "-created_at",
    )

    inlines = (
        ProjectImageInline,
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )
