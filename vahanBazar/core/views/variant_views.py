from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import VehicleModelVariant
from core.serializers.main_serializers import VehicleModelVariantSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class VehicleModelVariantViewSet(viewsets.ModelViewSet):
    queryset = VehicleModelVariant.objects.all()
    serializer_class = VehicleModelVariantSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['vehicle_model']
    search_fields = ['name', 'vehicle_model__name']
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        model_id = self.request.query_params.get('model', None)
        if model_id is not None:
            queryset = queryset.filter(vehicle_model_id=model_id)
        return queryset