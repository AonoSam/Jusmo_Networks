from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from accounts.permissions import IsManagerOrAbove

from .models import Project, ProjectImage
from .serializers import ProjectSerializer, ProjectWriteSerializer, ProjectImageSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    lookup_field = "slug"

    def get_queryset(self):
        is_staff_request = bool(self.request.user and self.request.user.is_authenticated)

        queryset = Project.objects.prefetch_related("services", "images")

        if not is_staff_request:
            queryset = queryset.filter(is_published=True)

        category = self.request.query_params.get("category")
        featured = self.request.query_params.get("featured")

        if category:
            queryset = queryset.filter(category__iexact=category)
        if featured == "true":
            queryset = queryset.filter(featured=True)

        return queryset

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ProjectWriteSerializer
        return ProjectSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        return [IsManagerOrAbove()]

    @action(detail=True, methods=["post"], permission_classes=[IsManagerOrAbove])
    def upload_image(self, request, slug=None):
        project = self.get_object()
        serializer = ProjectImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(project=project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], url_path="images/(?P<image_id>[^/.]+)", permission_classes=[IsManagerOrAbove])
    def delete_image(self, request, slug=None, image_id=None):
        project = self.get_object()
        try:
            image = project.images.get(pk=image_id)
        except ProjectImage.DoesNotExist:
            return Response({"detail": "Image not found."}, status=status.HTTP_404_NOT_FOUND)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)