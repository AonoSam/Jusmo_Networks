from django.urls import include, path
from rest_framework.routers import DefaultRouter

from company.views import CompanyViewSet
from services.views import ServiceViewSet
from projects.views import ProjectViewSet
from testimonials.views import TestimonialViewSet
from quotations.views import QuotationViewSet
from enquiries.views import EnquiryViewSet


router = DefaultRouter()

router.register(
    r"company",
    CompanyViewSet,
    basename="company",
)

router.register(
    r"services",
    ServiceViewSet,
    basename="services",
)

router.register(
    r"projects",
    ProjectViewSet,
    basename="projects",
)

router.register(
    r"testimonials",
    TestimonialViewSet,
    basename="testimonials",
)

router.register(
    r"quotations",
    QuotationViewSet,
    basename="quotations",
)

router.register(
    r"enquiries",
    EnquiryViewSet,
    basename="enquiries",
)

urlpatterns = [
    path("auth/", include("accounts.urls")),
] + router.urls

urlpatterns = [
    path("auth/", include("accounts.urls")),
    path("analytics/", include("analytics.urls")),
    path("audit/", include("audit.urls")),
] + router.urls