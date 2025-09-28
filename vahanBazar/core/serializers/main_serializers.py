from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import transaction
from core.models import (
    User, Dealership, Branch, Brand, VehicleModel,
    VehicleModelVariant, InventoryItem
)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class VehicleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = '__all__'


class VehicleModelVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModelVariant
        fields = '__all__'


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['id', 'name', 'address', 'city', 'state', 'contact_number']


class DealershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealership
        fields = ['name', 'description']


class UserRegisterSerializer(serializers.ModelSerializer):
    dealership = DealershipSerializer(required=False)
    branch = BranchSerializer(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_dealer', 'dealership', 'branch']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data.get('is_dealer'):
            if not data.get('dealership'):
                raise serializers.ValidationError("Dealership data is required for dealer registration.")
            if not data.get('branch'):
                raise serializers.ValidationError("Branch data is required for dealer registration.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        is_dealer = validated_data.get('is_dealer', False)
        dealership_data = validated_data.pop('dealership', None)
        branch_data = validated_data.pop('branch', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_dealer=is_dealer
        )

        if is_dealer and dealership_data and branch_data:
            dealership = Dealership.objects.create(owner=user, **dealership_data)
            Branch.objects.create(dealership=dealership, **branch_data)

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError("Invalid credentials")


# Serializers for Dealer Portal

class DealerBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class DealerDealershipSerializer(serializers.ModelSerializer):
    branches = DealerBranchSerializer(many=True, read_only=True)

    class Meta:
        model = Dealership
        fields = ['id', 'name', 'owner', 'description', 'branches']


class InventoryItemSerializer(serializers.ModelSerializer):
    new_variant_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = InventoryItem
        fields = '__all__'

    def create(self, validated_data):
        new_variant_name = validated_data.pop('new_variant_name', None)
        vehicle_model_id = self.context['request'].data.get('vehicle_model')

        if new_variant_name and vehicle_model_id:
            vehicle_model = VehicleModel.objects.get(id=vehicle_model_id)
            variant, created = VehicleModelVariant.objects.get_or_create(
                vehicle_model=vehicle_model, 
                name=new_variant_name
            )
            validated_data['vehicle_model_variant'] = variant

        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_variant_name = validated_data.pop('new_variant_name', None)
        vehicle_model_id = self.context['request'].data.get('vehicle_model')

        if new_variant_name and vehicle_model_id:
            vehicle_model = VehicleModel.objects.get(id=vehicle_model_id)
            variant, created = VehicleModelVariant.objects.get_or_create(
                vehicle_model=vehicle_model, 
                name=new_variant_name
            )
            validated_data['vehicle_model_variant'] = variant

        return super().update(instance, validated_data)
