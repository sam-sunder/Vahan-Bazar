from rest_framework import serializers
from core.models import Booking
from .vehicle_serializers import VehicleModelSerializer

class BookingSerializer(serializers.ModelSerializer):
    inventory_item = serializers.StringRelatedField()
    branch = serializers.StringRelatedField()

    class Meta:
        model = Booking
        fields = ['id', 'booking_type', 'preferred_date', 'preferred_time', 'status', 'created_at', 'inventory_item', 'branch']
