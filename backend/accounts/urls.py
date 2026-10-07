from django.urls import path

from .views import (
    CurrentUserView,
    StaffLoginView,
    CookieTokenRefreshView,
    LogoutView,
    NotificationsView,
    StaffAccountViewSet,
    ChangePasswordView,
)

from .views import (
    CurrentUserView, StaffLoginView, CookieTokenRefreshView,
    LogoutView, NotificationsView, StaffAccountViewSet, ChangePasswordView,
)

urlpatterns = [
    path("login/", StaffLoginView.as_view(), name="staff-login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="staff-token-refresh"),
    path("logout/", LogoutView.as_view(), name="staff-logout"),
    path("me/", CurrentUserView.as_view(), name="staff-current-user"),
    path("change-password/", ChangePasswordView.as_view(), name="staff-change-password"),
    path("notifications/", NotificationsView.as_view(), name="staff-notifications"),
    path("staff-accounts/", StaffAccountViewSet.as_view({"get": "list", "post": "create"}), name="staff-accounts-list"),
    path("staff-accounts/<int:pk>/", StaffAccountViewSet.as_view({
        "get": "retrieve", "patch": "partial_update", "delete": "destroy"
    }), name="staff-accounts-detail"),
]