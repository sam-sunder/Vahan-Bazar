from rest_framework import serializers
from core.models import User, Dealership

class DealershipProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealership
        fields = ['name', 'description']

class DealerProfileSerializer(serializers.ModelSerializer):
    dealership = DealershipProfileSerializer(source='owned_dealerships.first', required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'dealership']

    def update(self, instance, validated_data):
        # The source argument is not working as expected with nested writes.
        # We will use the initial_data to get the dealership data.
        dealership_data = self.initial_data.get('dealership')
        
        if dealership_data:
            dealership = instance.owned_dealerships.first()
            if dealership:
                dealership_serializer = DealershipProfileSerializer(dealership, data=dealership_data, partial=True)
                if dealership_serializer.is_valid(raise_exception=True):
                    dealership_serializer.save()

        # Pop dealership from validated_data if it exists
        validated_data.pop('owned_dealerships.first', None)

        # Update user fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.save()

        return instance