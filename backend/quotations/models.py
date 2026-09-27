from django.db import models

from common.models import TimeStampedModel
from services.models import Service


class Quotation(TimeStampedModel):

    class Status(models.TextChoices):
        NEW = "new", "New"
        REVIEWING = "reviewing", "Reviewing"
        CONTACTED = "contacted", "Contacted"
        QUOTED = "quoted", "Quoted"
        ACCEPTED = "accepted", "Accepted"
        REJECTED = "rejected", "Rejected"
        COMPLETED = "completed", "Completed"

    client_name = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255, blank=True)

    phone = models.CharField(max_length=50)
    email = models.EmailField()

    location = models.CharField(max_length=255)

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name="quotations",
    )

    project_description = models.TextField()

    preferred_project_date = models.DateField(
        null=True,
        blank=True,
    )

    budget_range = models.CharField(
        max_length=255,
        blank=True,
    )

    additional_comments = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.client_name} - {self.service.name}"