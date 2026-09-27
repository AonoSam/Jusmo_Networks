from django.db import models
from django.utils.text import slugify

from common.models import TimeStampedModel


class Service(TimeStampedModel):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)

    short_description = models.TextField()
    description = models.TextField()

    icon = models.CharField(max_length=100, blank=True)

    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Service.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name