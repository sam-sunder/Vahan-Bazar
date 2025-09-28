from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import UsedBikeListing
from ..serializers.used_listing_serializers import UsedBikeListingSerializer
from ..permissions import IsDealerStaff
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class UsedBikeListingViewSet(viewsets.ModelViewSet):
    queryset = UsedBikeListing.objects.all()
    serializer_class = UsedBikeListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[IsDealerStaff])
    def approve(self, request, pk=None):
        listing = self.get_object()
        listing.approved = True
        listing.save()
        return Response({'status': 'approved'})
