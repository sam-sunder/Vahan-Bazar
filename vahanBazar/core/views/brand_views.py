from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Brand, VehicleModel
from core.serializers.main_serializers import BrandSerializer, VehicleModelSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = VehicleModel.objects.all()
    serializer_class = VehicleModelSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'category']
    search_fields = ['name', 'brand__name']
    ordering_fields = ['name']
    permission_classes = [IsAuthenticatedOrReadOnly]
