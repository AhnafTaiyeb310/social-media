from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, RetrieveModelMixin, ListModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from . import models 
from . import serializers
from .permissions import isOwner
import logging

logger = logging.getLogger(__name__)

class ProfileViewSet(GenericViewSet, CreateModelMixin, UpdateModelMixin, RetrieveModelMixin, ListModelMixin):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    lookup_field = 'user__username'

    def get_serializer_context(self):
        return {'request': self.request}

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

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            profile, created = models.Profile.objects.get_or_create(user=request.user)
            
            if request.method == "GET":
                serializer = self.get_serializer(profile)
                return Response(serializer.data)
            
            # Django + CloudinaryField handles the upload automatically when serializer.save() is called
            serializer = self.get_serializer(profile, data=request.data, partial=True) 
            serializer.is_valid(raise_exception=True)
            updated_profile = serializer.save()
            
            return Response(self.get_serializer(updated_profile).data)
            
        except Exception as e:
            logger.exception(f"Profile update failed for user {request.user.id}:")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class ProfileFollowViewset(GenericViewSet, RetrieveModelMixin):
    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    lookup_field = 'user__username'

    def get_permissions(self):
        if self.action in ['retrieve', 'followers_list', 'following_list']:
            return [AllowAny()]
        return [IsAuthenticated()]

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

        # Return updated profile data using serializer with context
        serializer = serializers.ProfileListSerializer(profile, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
        
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


# -------------------------------------------------------------
# DJ-Rest-Auth Integrations (Social Logic + Email Verification)
# -------------------------------------------------------------
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.FRONTEND_URL
    client_class = OAuth2Client
    permission_classes = [AllowAny]

class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    callback_url = settings.FRONTEND_URL
    client_class = OAuth2Client
    permission_classes = [AllowAny]

from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from urllib.parse import unquote
from rest_framework.views import APIView

class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        key = request.data.get('key')
        if not key:
            return Response({"error": "Key is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure key is URL-decoded (important for keys containing colons)
        key = unquote(key)
        logger.info(f"Attempting to verify email with key: {key}")
        confirmation = EmailConfirmationHMAC.from_key(key)
        if not confirmation:
            logger.warning(f"HMAC confirmation not found for key: {key}")
            # Fallback to standard DB records
            try:
                confirmation = EmailConfirmation.objects.get(key=key) 
                logger.info("Found confirmation in DB")
            except EmailConfirmation.DoesNotExist:
                logger.error(f"Confirmation not found in DB for key: {key}")
                return Response({"error": "Invalid or expired key"}, status=status.HTTP_400_BAD_REQUEST)
        
        confirmation.confirm(request) # Marks email as verified
        logger.info(f"Verification successful for key: {key}")
        return Response({"message": "Successfully verified"})