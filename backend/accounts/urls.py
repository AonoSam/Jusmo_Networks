from django.urls import path

from .views import (
    CurrentUserView,
    StaffLoginView,
    CookieTokenRefreshView,
    LogoutView,
    NotificationsView,
    StaffAccountViewSet,
)

staff_list = StaffAccountViewSet.as_view({"get": "list", "post": "create"})
staff_detail = StaffAccountViewSet.as_view({
    "get": "retrieve", "patch": "partial_update", "delete": "destroy"
})

urlpatterns = [
    path("login/", StaffLoginView.as_view(), name="staff-login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="staff-token-refresh"),
    path("logout/", LogoutView.as_view(), name="staff-logout"),
    path("me/", CurrentUserView.as_view(), name="staff-current-user"),
    path("notifications/", NotificationsView.as_view(), name="staff-notifications"),
    path("staff-accounts/", staff_list, name="staff-accounts-list"),
    path("staff-accounts/<int:pk>/", staff_detail, name="staff-accounts-detail"),
]