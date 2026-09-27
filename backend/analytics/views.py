from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsStaffUser

from enquiries.models import Enquiry
from quotations.models import Quotation
from projects.models import Project
from services.models import Service
from testimonials.models import Testimonial


def monthly_series(queryset, months=6):
    since = timezone.now() - relativedelta(months=months - 1)
    rows = (
        queryset.filter(created_at__gte=since)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(count=Count("id"))
        .order_by("month")
    )
    by_month = {row["month"].strftime("%Y-%m"): row["count"] for row in rows}

    series = []
    for i in range(months - 1, -1, -1):
        month_date = timezone.now() - relativedelta(months=i)
        key = month_date.strftime("%Y-%m")
        series.append({
            "month": month_date.strftime("%b"),
            "count": by_month.get(key, 0),
        })
    return series


class SummaryView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        return Response({
            "projects": Project.objects.count(),
            "services": Service.objects.count(),
            "testimonials": Testimonial.objects.count(),
            "enquiries": Enquiry.objects.count(),
            "quotations": Quotation.objects.count(),
        })


class EnquiriesMonthlyView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        return Response(monthly_series(Enquiry.objects.all()))


class QuotationsMonthlyView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        return Response(monthly_series(Quotation.objects.all()))


class TopServicesView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        rows = (
            Quotation.objects.values("service__name")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )
        return Response([
            {"name": row["service__name"] or "Unspecified", "count": row["count"]}
            for row in rows
        ])


class ProjectCategoriesView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        rows = (
            Project.objects.values("category")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return Response([
            {"name": row["category"], "count": row["count"]}
            for row in rows
        ])


class ConversionView(APIView):
    permission_classes = (IsStaffUser,)

    def get(self, request):
        enquiries = Enquiry.objects.count()
        quotations = Quotation.objects.count()
        rate = round((quotations / enquiries) * 100, 1) if enquiries else 0

        return Response({
            "enquiries": enquiries,
            "quotations": quotations,
            "rate": rate,
            "note": "Approximate — enquiries and quotations are not linked per-submission.",
        })