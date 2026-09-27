from rest_framework.permissions import BasePermission


def get_staff_role(user):
    profile = getattr(user, "staff_profile", None)
    return profile.role if profile else None


class IsStaffUser(BasePermission):
    """Any authenticated user with a StaffProfile, any role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and get_staff_role(request.user) is not None
        )


class IsManagerOrAbove(BasePermission):

    def has_permission(self, request, view):
        role = get_staff_role(request.user) if request.user.is_authenticated else None
        return role in ("super_admin", "manager")


class IsSuperAdmin(BasePermission):

    def has_permission(self, request, view):
        role = get_staff_role(request.user) if request.user.is_authenticated else None
        return role == "super_admin"