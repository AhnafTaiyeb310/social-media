# views.py

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
import requests

from .models import SocialAccount
from .auth_views import set_refresh_cookie

User = get_user_model()


class GoogleLoginView(APIView):
    permission_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # ✅ Verify token with Google
            idinfo = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            name = idinfo.get("name", "")
            provider_user_id = idinfo.get("sub")  # UNIQUE GOOGLE ID

            if not email:
                return Response({"error": "Email not available"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                # 1. Check if Google account already linked
                social = SocialAccount.objects.filter(
                    provider="google",
                    provider_user_id=provider_user_id
                ).select_related("user").first()

                if social:
                    user = social.user
                else:
                    # 2. Check if user exists with same email
                    user = User.objects.filter(email=email).first()

                    if user:
                        # ✅ Link Google to existing user
                        SocialAccount.objects.get_or_create(
                            user=user,
                            provider="google",
                            provider_user_id=provider_user_id
                        )
                    else:
                        # 3. Create new user
                        user = User.objects.create(
                            email=email,
                            username=email.split("@")[0]
                        )

                        SocialAccount.objects.create(
                            user=user,
                            provider="google",
                            provider_user_id=provider_user_id
                        )

            # ✅ Issue JWT
            refresh = RefreshToken.for_user(user)
            access = str(refresh.access_token)

            response = Response({"access": access}, status=status.HTTP_200_OK)
            set_refresh_cookie(response, refresh)

            return response

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)


class FacebookLoginView(APIView):
    permission_classes = []

    def post(self, request):
        access_token = request.data.get("token")

        if not access_token:
            return Response({"error": "No token"}, status=status.HTTP_400_BAD_REQUEST)

        # Verify token with Facebook
        fb_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}"
        fb_response = requests.get(fb_url)
        data = fb_response.json()

        if "error" in data:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        email = data.get("email")
        name = data.get("name")
        provider_user_id = data.get("id")

        if not email:
            return Response({"error": "Email not provided"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            social = SocialAccount.objects.filter(
                provider="facebook",
                provider_user_id=provider_user_id
            ).select_related("user").first()

            if social:
                user = social.user
            else:
                user = User.objects.filter(email=email).first()
                if not user:
                    user = User.objects.create(
                        email=email,
                        username=email.split("@")[0]
                    )
                
                SocialAccount.objects.get_or_create(
                    user=user,
                    provider="facebook",
                    provider_user_id=provider_user_id
                )

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response({"access": access}, status=status.HTTP_200_OK)
        set_refresh_cookie(response, refresh)

        return response
