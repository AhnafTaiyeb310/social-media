from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from . import models 
from . import serializers
from .permissions import isOwner
import os
import uuid
from django.conf import settings
from .tasks import upload_profile_pic_task

class ProfileViewSet(GenericViewSet, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['partial_update', 'update', 'me']:
            return [IsAuthenticated(), isOwner()]
        if self.action in ['create']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)
    
    def perform_update(self, serializer):
        profile = serializer.save()
        file_obj = self.request.FILES.get('profile_picture')
        if file_obj:
            tmp_dir = os.path.join(settings.MEDIA_ROOT, 'tmp')
            os.makedirs(tmp_dir, exist_ok=True)
            file_extension = os.path.splitext(file_obj.name)[1]
            unique_name = f"profile_{profile.id}_{uuid.uuid4()}{file_extension}"
            tmp_path = os.path.join(tmp_dir, unique_name)
            
            with open(tmp_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            
            upload_profile_pic_task.delay(profile.id, tmp_path)

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            # Get or create profile for the current user
            profile, created = models.Profile.objects.get_or_create(user=request.user)
            
            if request.method == "GET":
                serializer = serializers.ProfileSerializer(profile)
                return Response(serializer.data)
            
            serializer = serializers.ProfileSerializer(profile, data=request.data, partial=True) 
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class ProfileFollowViewset(GenericViewSet):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileListSerializer

    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def follow(self, request, pk= None):
        profile = self.get_object()

        if profile.user == request.user :
            return Response({"detail": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        if profile.followers.filter(id= request.user.id).exists():
            profile.followers.remove(request.user)
            is_following = False
        else:
            profile.followers.add(request.user)
            is_following = True

        return Response({
            "is_following": is_following,
            "followers_count": profile.followers.count(),
            "followings_count": models.Profile.objects.filter(followers__in= [profile.user]).count()
        }, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def suggestions(self, request):
        # Return profiles that the current user is not following
        # and it's not the user's own profile
        user = request.user
        suggestions = models.Profile.objects.exclude(
            Q(followers=user) | Q(user=user)
        ).order_by('?')[:5]
        
        serializer = serializers.ProfileListSerializer(suggestions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'], permission_classes=[AllowAny])
    def followers_list(self, request, pk= None):
        profile = self.get_object()
        followers_profile = models.Profile.objects.filter(user__in= profile.followers.all())
        serializer = serializers.ProfileSerializer(followers_profile, many= True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['GET'], permission_classes=[AllowAny])
    def following_list(self, request, pk= None):
        profile = self.get_object()
        followings_profile = models.Profile.objects.filter(followers=profile.user)
        serializer = serializers.ProfileSerializer(followings_profile, many= True)
        return Response(serializer.data)