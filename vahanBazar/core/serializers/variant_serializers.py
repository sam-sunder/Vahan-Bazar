from rest_framework import serializers
from core.models import VehicleModelVariant as Variant

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'name', 'vehicle_model', 'specs']

    def validate(self, data):
        # Check if variant name already exists for this model
        if Variant.objects.filter(
            vehicle_model=data['vehicle_model'],
            name=data['name']
        ).exists():
            raise serializers.ValidationError({
                "name": "A variant with this name already exists for this model."
            })
        return data

    def validate_specs(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Specs must be a dictionary")
        return value