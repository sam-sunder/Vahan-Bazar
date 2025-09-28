from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from core.models import User, Branch, VehicleModel, Booking
from core.serializers.dealer_serializers import DealerProfileSerializer
from core.serializers.main_serializers import DealerBranchSerializer
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db import models

class DealerDashboardView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        if not user.is_dealer or not hasattr(user, 'owned_dealerships'):
            return Response({"error": "User is not a dealer"}, status=403)

        dealership = user.owned_dealerships.first()
        if not dealership:
            return Response({"error": "Dealer has no dealership"}, status=404)

        total_vehicles = VehicleModel.objects.filter(dealer=dealership).count()
        new_vehicles = VehicleModel.objects.filter(dealer=dealership, type='NEW').count()
        used_vehicles = VehicleModel.objects.filter(dealer=dealership, type='USED').count()

        branches = Branch.objects.filter(dealership=dealership)
        total_bookings = Booking.objects.filter(branch__in=branches).count()

        # Vehicle added over last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        vehicles_over_time = (
            VehicleModel.objects.filter(dealer=dealership, added_on__gte=thirty_days_ago)
            .extra(select={'date': 'date(added_on)'})
            .values('date')
            .annotate(count=models.Count('id'))
            .order_by('date')
        )

        data = {
            'total_vehicles': total_vehicles,
            'new_vehicles': new_vehicles,
            'used_vehicles': used_vehicles,
            'total_bookings': total_bookings,
            'vehicles_over_time': list(vehicles_over_time)
        }
        return Response(data)

class DealerProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = DealerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class DealerBranchViewSet(viewsets.ModelViewSet):
    serializer_class = DealerBranchSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['dealership']

    def get_queryset(self):
        user = self.request.user
        if user.is_dealer and hasattr(user, 'owned_dealerships'):
            dealership = user.owned_dealerships.first()
            if dealership:
                return Branch.objects.filter(dealership=dealership)
        return Branch.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_dealer and hasattr(user, 'owned_dealerships'):
            dealership = user.owned_dealerships.first()
            if dealership:
                serializer.save(dealership=dealership)