from rest_framework.views import APIView
from rest_framework.response import Response
from ..models import InventoryItem

class CompareAPIView(APIView):
    def get(self, request):
        v1_id = request.query_params.get('v1')
        v2_id = request.query_params.get('v2')
        v1 = InventoryItem.objects.get(pk=v1_id)
        v2 = InventoryItem.objects.get(pk=v2_id)

        # simplified diff
        diff_fields = []
        for field in ['price', 'vehicle_model__mileage', 'vehicle_model__fuel_type']:
            val1 = getattr(v1.vehicle_model, field.split('__')[-1], None)
            val2 = getattr(v2.vehicle_model, field.split('__')[-1], None)
            if val1 != val2:
                diff_fields.append(field)

        return Response({
            'left': {'id': v1.id, 'name': v1.vehicle_model.name, 'price': v1.price},
            'right': {'id': v2.id, 'name': v2.vehicle_model.name, 'price': v2.price},
            'differences': diff_fields
        })
