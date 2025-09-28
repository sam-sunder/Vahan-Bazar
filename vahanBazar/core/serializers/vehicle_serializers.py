from rest_framework import serializers
from core.models import VehicleModel, VehicleImage, Branch, Dealership

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'order']

class VehicleModelSerializer(serializers.ModelSerializer):
    images = VehicleImageSerializer(many=True, read_only=True)
    specs = serializers.SerializerMethodField()
    brand_detail = serializers.SerializerMethodField(read_only=True)
    dealer = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
    branch = serializers.SerializerMethodField()
    variant = serializers.SerializerMethodField()
    
    class Meta:
        model = VehicleModel
        fields = [
            'id', 'brand', 'brand_detail', 'dealer', 'seller', 'branch', 'name', 'category', 
            'fuel_type', 'price', 'status', 'is_featured', 'type',
            'images', 'discount_type', 'variant',
            'discount_value', 'discount_description', 'created_at',
            'year', 'km_driven', 'condition', 'exchange_offer', 
            'loan_option', 'approved', 'specs', 'model_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'name': {'required': True},
            'brand': {'required': True},
            'price': {'required': True},
            'category': {'required': True},
            'type': {'required': True},
            'variants': {'required': False},
            'images': {'required': False},
            # Used vehicle fields are optional
            'year': {'required': False},
            'km_driven': {'required': False},
            'condition': {'required': False},
            'exchange_offer': {'required': False},
            'loan_option': {'required': False},
            'approved': {'required': False},
            'specs': {'required': True},
        }
    
    def get_specs(self, obj):
        """Return effective specs based on vehicle type"""
        return obj.get_effective_specs()
    
    def get_brand_detail(self, obj):
        """Return brand with id and name"""
        if obj.brand:
            return {'id': obj.brand.id, 'name': obj.brand.name}
        return None
    
    def get_dealer(self, obj):
        """Return dealer with id and name"""
        if obj.dealer:
            return {'id': obj.dealer.id, 'name': obj.dealer.name}
        return None
    
    def get_seller(self, obj):
        """Return seller with id and name"""
        if obj.seller:
            return {'id': obj.seller.id, 'name': obj.seller.get_full_name() or obj.seller.username}
        return None
    
    def get_branch(self, obj):
        """Return branch with id and name"""

        if obj.branch:
            return {'id': obj.branch.id, 'name': obj.branch.name}
        return None
    
    def get_variant(self, obj):
        """Return variant with id and name if exists"""
        if obj.variant:
            return {'id': obj.variant.id, 'name': obj.variant.name}
        return None
    
    def validate(self, data):
        # Validate brand
        # if not data.get('brand'):
        #     raise serializers.ValidationError({
        #         "brand": "Brand is required"
        #     })
            
        # Validate discount fields
        if data.get('discount_type') and not data.get('discount_value'):
            raise serializers.ValidationError({
                "discount_value": "Discount value is required when discount type is set"
            })
        if data.get('discount_value') and not data.get('discount_type'):
            raise serializers.ValidationError({
                "discount_type": "Discount type is required when discount value is set"
            })
        
        # Validate vehicle type specific fields
        # vehicle_type = data.get('type')

        # if vehicle_type == 'NEW':
        #     # For new vehicles, dealer and branch are required
        #     if not self.context.get('dealer'):
        #         raise serializers.ValidationError({
        #             "dealer": "Dealer is required for new vehicles"
        #         })
        #     if not self.context.get('branch'):
        #         raise serializers.ValidationError({
        #             "branch": "Branch is required for new vehicles"
        #         })
        # elif vehicle_type == 'USED':
        #     # For used vehicles, seller is required
        #     if not self.context.get('seller'):
        #         raise serializers.ValidationError({
        #             "seller": "Seller is required for used vehicles"
        #         })
        
        return data
    
    def create(self, validated_data):
        images = self.context.pop('images', [])
        
        # Ensure brand is properly set
        if 'brand' not in validated_data:
            raise serializers.ValidationError({"brand": "Brand is required"})
            
        print("Creating vehicle with data:", validated_data)
        
        try:
            vehicle = VehicleModel.objects.create(**validated_data)
            
            # Create vehicle images
            for index, img in enumerate(images):
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=img,
                    order=index
                )
            
            return vehicle
        except Exception as e:
            print("Error creating vehicle:", str(e))
            raise serializers.ValidationError({"detail": str(e)})
        
    def update(self, instance, validated_data):

        images = self.context.pop('images', [])
        vehicle = super().update(instance, validated_data)

        if images is not None:
            if len(images) < 3:
                raise serializers.ValidationError({"images": "At least 3 images are required"})
                
            # Delete existing images
            instance.images.all().delete()
            
            # Create new images
            for index, image in enumerate(images):
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=image,
                    order=index
                )
        print(validated_data)
        instance.specs = validated_data.get('specs', '')
        instance.save()

        return vehicle

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'address', 'city', 'state', 'zipcode',
                 'contact_number', 'latitude', 'longitude', 'location_details']
        
    def validate_zipcode(self, value):
        # Add your country-specific zipcode validation
        if not value.isdigit() or len(value) != 6:  # For Indian PIN codes
            raise serializers.ValidationError("Invalid zipcode format. Must be 6 digits.")
        return value

class DealershipSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Dealership
        fields = ['id', 'name', 'description', 'branches']