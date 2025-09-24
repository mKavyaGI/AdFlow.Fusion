from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserAdAccount, AdPlatform

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class AdPlatformSerializer(serializers.ModelSerializer):
    """Serializer for the AdPlatform model."""
    class Meta:
        model = AdPlatform
        fields = ('id', 'name', 'auth_type')

class UserAdAccountSerializer(serializers.ModelSerializer):
    """Serializer for creating and listing UserAdAccount connections."""
    # We want to show the platform name, not just its ID number.
    platform = serializers.StringRelatedField()

    class Meta:
        model = UserAdAccount
        fields = ('id', 'user', 'platform', 'account_name', 'customer_id', 'updated_at')
        # The user field is read-only because it will be set automatically from the logged-in user.
        read_only_fields = ('user',)
