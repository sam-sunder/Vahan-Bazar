from rest_framework.views import APIView
from rest_framework.response import Response

class EMICalculatorAPIView(APIView):
    def get(self, request):
        price = float(request.query_params.get('price', 0))
        tenure = int(request.query_params.get('tenure_months', 12))
        rate = float(request.query_params.get('rate', 10))  # annual %
        r = rate/(12*100)
        emi = price*r*((1+r)**tenure)/(((1+r)**tenure)-1)
        return Response({'monthly_emi': round(emi,2)})

class FuelCalculatorAPIView(APIView):
    def get(self, request):
        distance = float(request.query_params.get('distance_per_month', 0))
        mileage = float(request.query_params.get('mileage', 1))
        fuel_price = float(request.query_params.get('fuel_price', 100))
        monthly_cost = distance/mileage*fuel_price
        return Response({'monthly_fuel_cost': round(monthly_cost,2)})
