from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid

class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        file_ext = image_file.name.split('.')[-1]
        filename = f'vehicles/{uuid.uuid4()}.{file_ext}'

        # Save the file
        path = default_storage.save(filename, ContentFile(image_file.read()))
        image_url = default_storage.url(path)

        return Response({'url': image_url}, status=status.HTTP_201_CREATED)