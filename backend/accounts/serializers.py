from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import StaffProfile


class StaffTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = getattr(user, "staff_profile", None)
        token["role"] = profile.role if profile else None
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        profile = getattr(self.user, "staff_profile", None)
        if profile is None:
            raise serializers.ValidationError("This account does not have staff access.")
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "role": profile.role,
            "must_change_password": profile.must_change_password,
        }
        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value


class CurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="user.id")
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    role = serializers.CharField()


class StaffAccountSerializer(serializers.ModelSerializer):
    """Manages User + StaffProfile together — create, edit role, reset password."""

    role = serializers.ChoiceField(choices=StaffProfile.Role.choices, write_only=True)
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=False, min_length=8
    )

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "role", "is_active", "password", "date_joined",
        )
        read_only_fields = ("id", "date_joined")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.pop("password", None)
        profile = getattr(instance, "staff_profile", None)
        data["role"] = profile.role if profile else None
        return data

    def create(self, validated_data):
        role = validated_data.pop("role")
        password = validated_data.pop("password", None)

        if not password:
            raise serializers.ValidationError(
                {"password": "Password is required when creating a staff account."}
            )

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        StaffProfile.objects.create(user=user, role=role)
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if role:
            profile, _ = StaffProfile.objects.get_or_create(user=instance)
            profile.role = role
            profile.save()

        return instance
    
    def validate_password(self, value):
        if value:
            try:
                validate_password(value)
            except DjangoValidationError as e:
                raise serializers.ValidationError(list(e.messages))
        return value