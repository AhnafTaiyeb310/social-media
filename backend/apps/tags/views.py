# views.py
from rest_framework import viewsets
from . import models
from . import serializers
from rest_framework.permissions import AllowAny

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer
    permission_classes = [AllowAny]