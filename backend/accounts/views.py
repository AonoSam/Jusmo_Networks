from django.contrib.auth.models import User
from django.conf import settings

from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from enquiries.models import Enquiry
from quotations.models import Quotation
from audit.utils import log_action

from .permissions import IsStaffUser, IsSuperAdmin
from .serializers import StaffTokenObtainPairSerializer, StaffAccountSerializer
from .serializers import (
    StaffTokenObtainPairSerializer,
    StaffAccountSerializer,
    ChangePasswordSerializer,
)
from audit.mixins import AuditLogMixin

def _cookie_kwargs(max_age):
    return dict(
        httponly=True,
        secure=not settings.DEBUG,
        samesite="Lax",
        max_age=max_age,
    )


class StaffLoginView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access = response.data.pop("access")
            refresh = response.data.pop("refresh")

            response.set_cookie("access_token", access, **_cookie_kwargs(30 * 60))
            response.set_cookie("refresh_token", refresh, **_cookie_kwargs(7 * 24 * 60 * 60))

            # request.user isn't populated yet at this point (login just happened,
            # not an authenticated request) — pull the username from what we
            # already returned instead.
            username = response.data.get("user", {}).get("username", "")
            from django.contrib.auth.models import User
            actor = User.objects.filter(username=username).first()

            from audit.models import AuditLog
            AuditLog.objects.create(
                actor=actor,
                actor_username=username,
                action="login",
                ip_address=request.META.get("REMOTE_ADDR"),
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
            )
        else:
            log_action(request, "login_failed", object_repr=str(request.data.get("username", "")))

        return response



class CookieTokenRefreshView(TokenRefreshView):
    """
    Reads the refresh token from the httpOnly cookie (not the request body),
    and writes the rotated access/refresh tokens back as cookies.
    """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=401)

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access = response.data.pop("access")
            response.set_cookie("access_token", access, **_cookie_kwargs(30 * 60))

            new_refresh = response.data.pop("refresh", None)
            if new_refresh:
                response.set_cookie("refresh_token", new_refresh, **_cookie_kwargs(7 * 24 * 60 * 60))

        return response


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        log_action(request, "logout")

        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass

        response = Response(status=205)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class CurrentUserView(APIView):
    permission_classes = (IsAuthenticated, IsStaffUser)

    def get(self, request):
        profile = request.user.staff_profile
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "role": profile.role,
            "must_change_password": profile.must_change_password,
        })


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated, IsStaffUser)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])

        if serializer.validated_data.get("first_name"):
            user.first_name = serializer.validated_data["first_name"]
        if serializer.validated_data.get("last_name"):
            user.last_name = serializer.validated_data["last_name"]
        if serializer.validated_data.get("email"):
            user.email = serializer.validated_data["email"]

        user.save()

        profile = user.staff_profile
        profile.must_change_password = False
        profile.save()

        log_action(request, "update", instance=user, object_repr=f"{user.username} — password changed")

        return Response({"detail": "Password changed successfully."})


class StaffAccountViewSet(AuditLogMixin, viewsets.ModelViewSet):
    serializer_class = StaffAccountSerializer
    permission_classes = (IsSuperAdmin,)
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return (
            User.objects.filter(staff_profile__isnull=False)
            .select_related("staff_profile")
            .order_by("username")
        )

    def perform_destroy(self, instance):
        if instance.id == self.request.user.id:
            raise ValidationError("You cannot delete your own account.")
        log_action(self.request, "delete", instance=instance)
        instance.delete()


class NotificationsView(APIView):
    permission_classes = (IsAuthenticated, IsStaffUser)

    def get(self, request):
        new_enquiries = Enquiry.objects.filter(status="new").order_by("-created_at")[:10]
        new_quotations = Quotation.objects.filter(status="new").order_by("-created_at")[:10]

        items = []
        for e in new_enquiries:
            items.append({
                "id": e.id,
                "type": "enquiry",
                "title": e.name,
                "subtitle": e.subject,
                "created_at": e.created_at,
            })
        for q in new_quotations:
            items.append({
                "id": q.id,
                "type": "quotation",
                "title": q.client_name,
                "subtitle": q.company_name or "Quotation request",
                "created_at": q.created_at,
            })

        items.sort(key=lambda x: x["created_at"], reverse=True)

        return Response({
            "count": len(new_enquiries) + len(new_quotations),
            "items": items[:10],
        })