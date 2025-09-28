import logging
import json
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from core.models import VehicleModel, Brand, VehicleModelVariant as Variant, VehicleImage, Dealership
from core.serializers.vehicle_serializers import VehicleModelSerializer
from core.serializers.brand_serializers import BrandSerializer
from core.serializers.variant_serializers import VariantSerializer
from core.permissions import IsDealerOrReadOnly

# logger = logging.getLogger(__name__)

class VehicleModelViewSet(viewsets.ModelViewSet):
    queryset = VehicleModel.objects.all()
    serializer_class = VehicleModelSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'category', 'status', 'is_featured', 'branch']
    search_fields = ['name', 'brand__name']
    ordering_fields = ['price', 'created_at', 'updated_at']
    ordering = ['-created_at']  # Default ordering

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Price range filter
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if min_price is not None:
            queryset = queryset.filter(price__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price__lte=max_price)
            
        # Stock filter
        in_stock = self.request.query_params.get('in_stock', None)
        if in_stock is not None:
            if in_stock.lower() == 'true':
                queryset = queryset.filter(stock__gt=0)
            elif in_stock.lower() == 'false':
                queryset = queryset.filter(stock=0)
                
        # Discount filter
        has_discount = self.request.query_params.get('has_discount', None)
        if has_discount is not None:
            if has_discount.lower() == 'true':
                queryset = queryset.exclude(discount_type__isnull=True)
            elif has_discount.lower() == 'false':
                queryset = queryset.filter(discount_type__isnull=True)

        # Type filter
        vehicle_type = self.request.query_params.get('type', None)
        if vehicle_type is not None:
            queryset = queryset.filter(type=vehicle_type)

        return queryset

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # Get the form data and parse it
                data = request.POST.get('data')
                if not data:
                    raise ValidationError({
                        "data": "Vehicle data is required"
                    })

                data = json.loads(data)  # Parse the JSON string

                # Handle image uploads
                images = request.FILES.getlist('images')
                
                if not images or len(images) < 3:
                    raise ValidationError({
                        "images": "At least 3 images are required"
                    })

                # Handle user authentication and vehicle type
                user = request.user
                vehicle_type = data.get('type', 'NEW')
                
                # Extract nested data
                brand_data = data.get('brand')
                variant_data = data.get('variant')

                # Handle brand creation/retrieval
                brand_id = None
                if isinstance(brand_data, dict):
                    brand_serializer = BrandSerializer(data=brand_data)
                    if brand_serializer.is_valid(raise_exception=True):
                        brand = brand_serializer.save()
                        brand_id = brand.id
                else:
                    brand_id = brand_data
                context = {}
                # Set appropriate fields based on vehicle type
                if vehicle_type == 'NEW':
                    # For new vehicles, require dealer
                    if not user.is_dealer:
                        raise ValidationError({
                            "dealer": "User must have a dealer profile to create new vehicles"
                        })
                    dealership = Dealership.objects.filter(owner=user).first()
                    if not dealership:
                        raise ValidationError({
                            "dealer": "User must have a dealership to create new vehicles"
                        })
                    if not data.get('branch'):
                        raise ValidationError({
                            "branch": "Branch is required for new vehicles"
                        })
                    data['dealer'] = dealership.id
                    context['dealer'] = dealership.id
                elif vehicle_type == 'USED':
                    # For used vehicles, set seller
                    data['seller'] = user.id
                    context['seller'] = user.id
                
                data['brand'] = brand_id
                context['images'] = images
                # Create vehicle model
                serializer = self.get_serializer(data=data, context=context)
                serializer.is_valid(raise_exception=True)
                vehicle = serializer.save()
                vehicle.specs = data.get('specs', {})
                if data.get('branch'):
                    vehicle.branch_id = data.get('branch', '')
                if vehicle_type == 'USED':
                    vehicle.seller = user
                vehicle.save()
                # Handle variant creation/linking
                if isinstance(variant_data, dict):
                    variant_data['vehicle_model'] = vehicle.id
                    variant_serializer = VariantSerializer(data=variant_data)
                    if variant_serializer.is_valid(raise_exception=True):
                        variant = variant_serializer.save()
                        vehicle.variant = variant
                        vehicle.save()
                elif variant_data:
                    try:
                        variant = Variant.objects.get(id=variant_data)
                        vehicle.variant = variant
                        vehicle.save()
                    except Variant.DoesNotExist:
                        raise ValidationError({
                            "variant": f"Variant with ID {variant_data} does not exist"
                        })

                # Handle image uploads
                # for image in images:
                #     vehicle_image = VehicleImage.objects.create(
                #         vehicle=vehicle,
                #         image=image
                #     )

                # Add image URLs to response data
                response_data = serializer.data

                return Response(response_data, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            raise ValidationError({
                "data": "Invalid JSON data"
            })
        except ValidationError:
            raise
        except Exception as e:
            print(e)
            raise ValidationError({
                "non_field_errors": ["An error occurred while creating the vehicle. Please try again."]
            })

    def update(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # Get the form data and parse it
                data = request.POST.get('data')
                if not data:
                    raise ValidationError({
                        "data": "Vehicle data is required"
                    })

                data = json.loads(data)  # Parse the JSON string

                # Handle image uploads
                images = request.FILES.getlist('images')
                if not images or len(images) < 3:
                    raise ValidationError({
                        "images": "At least 3 images are required"
                    })

                # Handle user authentication and vehicle type
                user = request.user
                vehicle_type = data.get('type', 'NEW')
                
                # Extract nested data
                brand_data = data.get('brand')
                variant_data = data.get('variant')

                # Handle brand creation/retrieval
                brand_id = None
                if isinstance(brand_data, dict):
                    brand_serializer = BrandSerializer(data=brand_data)
                    if brand_serializer.is_valid(raise_exception=True):
                        brand = brand_serializer.save()
                        brand_id = brand.id
                else:
                    brand_id = brand_data
                context = {}
                # Set appropriate fields based on vehicle type
                if vehicle_type == 'NEW':
                    # For new vehicles, require dealer
                    if not user.is_dealer:
                        raise ValidationError({
                            "dealer": "User must have a dealer profile to create new vehicles"
                        })
                    dealership = Dealership.objects.filter(owner=user).first()
                    if not dealership:
                        raise ValidationError({
                            "dealer": "User must have a dealership to create new vehicles"
                        })
                    if not data.get('branch'):
                        raise ValidationError({
                            "branch": "Branch is required for new vehicles"
                        })
                    data['dealer'] = dealership.id
                    context['dealer'] = dealership.id
                elif vehicle_type == 'USED':
                    # For used vehicles, set seller
                    data['seller'] = user.id
                    context['seller'] = user.id
                
                data['brand'] = brand_id
                context['images'] = images
                # Create vehicle model
                serializer = self.get_serializer(instance=self.get_object(), data=data, context=context)
                serializer.is_valid(raise_exception=True)
                vehicle = serializer.save()
                vehicle.specs = data.get('specs', vehicle.specs)
                if data.get('branch'):
                    vehicle.branch_id = data.get('branch')
                if vehicle_type == 'USED':
                    vehicle.seller = user
                vehicle.save()
                # Handle variant creation/linking
                if isinstance(variant_data, dict):
                    variant_data['vehicle_model'] = vehicle.id
                    variant_serializer = VariantSerializer(data=variant_data)
                    if variant_serializer.is_valid(raise_exception=True):
                        variant = variant_serializer.save()
                        vehicle.variant = variant
                        vehicle.save()
                elif variant_data:
                    try:
                        variant = Variant.objects.get(id=variant_data)
                        vehicle.variant = variant
                        vehicle.save()
                    except Variant.DoesNotExist:
                        raise ValidationError({
                            "variant": f"Variant with ID {variant_data} does not exist"
                        })

                # Handle image uploads
                vehicle.images.all().delete()
                for image in images:
                    vehicle_image = VehicleImage.objects.create(
                        vehicle=vehicle,
                        image=image
                    )

                # Add image URLs to response data
                response_data = serializer.data

                return Response(response_data, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            raise ValidationError({
                "data": "Invalid JSON data"
            })
        except ValidationError:
            raise
        except Exception as e:
            print(e)
            raise ValidationError({
                "non_field_errors": ["An error occurred while creating the vehicle. Please try again."]
            })
    
    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        vehicle = self.get_object()
        stock = request.data.get('stock', None)
        
        if stock is None:
            return Response(
                {'error': 'Stock value is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stock = int(stock)
            if stock < 0:
                raise ValueError("Stock cannot be negative")
        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        vehicle.stock = stock
        vehicle.save()
        serializer = self.get_serializer(vehicle)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        vehicle = self.get_object()
        vehicle.is_featured = not vehicle.is_featured
        vehicle.save()
        serializer = self.get_serializer(vehicle)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def dealer_vehicles(self, request):
        """Get all vehicles for the authenticated dealer"""
        dealer = request.user.dealer
        queryset = self.get_queryset().filter(dealer=dealer)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured vehicles"""
        queryset = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)