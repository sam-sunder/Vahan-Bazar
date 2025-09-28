from rest_framework import serializers
from core.models import WishlistItem, VehicleModel
from .vehicle_serializers import VehicleModelSerializer

class WishlistItemSerializer(serializers.ModelSerializer):
    vehicle = VehicleModelSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=VehicleModel.objects.all(), source='vehicle', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'vehicle', 'vehicle_id', 'added_at']
        read_only_fields = ['id', 'added_at', 'vehicle']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
