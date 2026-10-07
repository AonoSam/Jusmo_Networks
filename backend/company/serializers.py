# from rest_framework import serializers

# from .models import Company


# class CompanySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Company
#         fields = "__all__"
from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = "__all__"

    def get_logo(self, obj):
        if not obj.logo:
            return None

        return obj.logo.build_url(
            secure=True
        )