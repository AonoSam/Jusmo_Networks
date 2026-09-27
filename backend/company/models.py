from django.db import models

from common.models import TimeStampedModel


class Company(TimeStampedModel):
    name = models.CharField(max_length=200)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField()

    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    values = models.TextField(blank=True)

    phone = models.CharField(max_length=50, blank=True)
    whatsapp = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)

    address = models.TextField(blank=True)
    google_maps_url = models.URLField(blank=True)

    facebook_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)

    logo = models.ImageField(
        upload_to="company/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return self.name