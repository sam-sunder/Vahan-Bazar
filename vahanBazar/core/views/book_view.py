from rest_framework import viewsets
from ..models import Booking, Branch
from ..serializers.booking_serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_dealer or user.is_dealer_staff or user.is_manager:
            # Assuming a dealer user is linked to a Dealership
            try:
                dealership = user.owned_dealerships.first()
                if dealership:
                    branches = Branch.objects.filter(dealership=dealership)
                    return Booking.objects.filter(branch__in=branches)
            except AttributeError:
                # Handle cases where user is not a dealer or has no dealership
                pass
        return Booking.objects.filter(user=user)