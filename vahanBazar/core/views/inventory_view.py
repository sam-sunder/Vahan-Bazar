from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import InventoryItem, VehicleImage
from ..serializers.inventory_serializers import InventoryItemSerializer, VehicleImageSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from ..permissions import IsDealerStaff

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['branch', 'vehicle_model_variant__vehicle_model__brand', 'price', 'status']
    search_fields = ['vehicle_model_variant__vehicle_model__name', 'vehicle_model_variant__vehicle_model__brand__name', 'branch__city']
    ordering_fields = ['price', 'added_on']
    permission_classes = [IsDealerStaff | IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        images_data = self.request.data.get('images', [])
        instance = serializer.save()
        
        # Create images
        for image_data in images_data:
            VehicleImage.objects.create(
                inventory_item=instance,
                image_url=image_data['url'],
                order=image_data.get('order', 0)
            )

    def perform_update(self, serializer):
        images_data = self.request.data.get('images', [])
        instance = serializer.save()
        
        # Update images
        instance.images.all().delete()  # Remove existing images
        for image_data in images_data:
            VehicleImage.objects.create(
                inventory_item=instance,
                image_url=image_data['url'],
                order=image_data.get('order', 0)
            )

class VehicleImageViewSet(viewsets.ModelViewSet):
    queryset = VehicleImage.objects.all()
    serializer_class = VehicleImageSerializer
    permission_classes = [IsDealerStaff | IsAuthenticatedOrReadOnly]
