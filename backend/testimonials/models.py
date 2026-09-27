from django.db import models

from common.models import TimeStampedModel


class Testimonial(TimeStampedModel):

    name = models.CharField(max_length=255)

    company_name = models.CharField(
        max_length=255,
        blank=True,
    )

    role = models.CharField(
        max_length=255,
        blank=True,
    )

    content = models.TextField()

    rating = models.PositiveSmallIntegerField(
        default=5,
    )

    image = models.ImageField(
        upload_to="testimonials/",
        blank=True,
        null=True,
    )

    is_published = models.BooleanField(
        default=True,
    )

    display_order = models.PositiveIntegerField(
        default=0,
    )

    class Meta:
        ordering = [
            "display_order",
            "-created_at",
        ]

    def __str__(self):
        return self.name
