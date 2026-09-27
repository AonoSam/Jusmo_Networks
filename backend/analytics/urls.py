from django.urls import path

from .views import (
    SummaryView,
    EnquiriesMonthlyView,
    QuotationsMonthlyView,
    TopServicesView,
    ProjectCategoriesView,
    ConversionView,
)

urlpatterns = [
    path("summary/", SummaryView.as_view(), name="analytics-summary"),
    path("enquiries-monthly/", EnquiriesMonthlyView.as_view(), name="analytics-enquiries-monthly"),
    path("quotations-monthly/", QuotationsMonthlyView.as_view(), name="analytics-quotations-monthly"),
    path("top-services/", TopServicesView.as_view(), name="analytics-top-services"),
    path("project-categories/", ProjectCategoriesView.as_view(), name="analytics-project-categories"),
    path("conversion/", ConversionView.as_view(), name="analytics-conversion"),
]