from rest_framework import serializers
from ..models import InventoryItem, VehicleImage, VehicleModelVariant

class VehicleModelVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModelVariant
        fields = '__all__'

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image_url', 'alt_text', 'order']

class InventoryItemSerializer(serializers.ModelSerializer):
    images = VehicleImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = InventoryItem
        fields = [
            'id', 'branch', 'vehicle_model_variant', 'price',
            'status', 'is_featured', 'specs_override', 
            'discount_type', 'discount_value', 'discount_description',
            'images', 'added_on'
        ]