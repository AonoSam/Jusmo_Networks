import os

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from accounts.models import StaffProfile


class Command(BaseCommand):
    help = "Create the default JUSMO Super Admin if one does not exist."

    def handle(self, *args, **options):
        username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
        password = os.getenv("DEFAULT_ADMIN_PASSWORD")
        email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@jusmonetworks.co.ke")
        first_name = os.getenv("DEFAULT_ADMIN_FIRST_NAME", "JUSMO")
        last_name = os.getenv("DEFAULT_ADMIN_LAST_NAME", "Administrator")

        if not password:
            self.stdout.write(self.style.ERROR("DEFAULT_ADMIN_PASSWORD is not configured."))
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        if created:
            user.set_password(password)
            user.save()

            StaffProfile.objects.create(
                user=user,
                role=StaffProfile.Role.SUPER_ADMIN,
                must_change_password=True,
            )

            self.stdout.write(self.style.SUCCESS(f"Default Super Admin '{username}' created."))
        else:
            self.stdout.write(self.style.WARNING(f"Super Admin '{username}' already exists. No changes made."))