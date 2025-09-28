from rest_framework import serializers
from core.models import Brand

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']

    def validate_name(self, value):
        # Convert to title case
        value = value.title()
        # Check if brand with this name already exists
        if Brand.objects.filter(name=value).exists():
            raise serializers.ValidationError("A brand with this name already exists.")
        return value