from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.models import User
from core.serializers.user_serializers import UserProfileSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
