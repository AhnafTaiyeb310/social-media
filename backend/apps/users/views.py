from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from . import models 
from . import serializers
from .permissions import isOwner


# Create your views here.

class ProfileViewSet(GenericViewSet, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['partial_update', 'update']:
            return [IsAuthenticated(), isOwner()]
        if self.action in ['create']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)
    

    @action(detail=False, methods=['GET', 'PUT'], permission_classes=[IsAuthenticated])
    def me(self,request):
        profile = request.user.profile
        if request.method == "GET":
            serializer = serializers.ProfileSerializer(profile)
            return Response(serializer.data)
        
        serializer = serializers.ProfileSerializer(profile, data=request.data) 
        serializer.is_valid(raise_exception = True)
        serializer.save()
        return Response(serializer.data)
    

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