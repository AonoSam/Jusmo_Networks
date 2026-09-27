from django.db import models

from common.models import TimeStampedModel


class Enquiry(TimeStampedModel):

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In Progress"
        RESPONDED = "responded", "Responded"
        CLOSED = "closed", "Closed"

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    email = models.EmailField()

    subject = models.CharField(max_length=255)
    message = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject}"