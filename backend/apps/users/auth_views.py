from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.conf import settings


def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        key=settings.AUTH_COOKIE,
        value=str(refresh_token),
        httponly=settings.AUTH_COOKIE_HTTP_ONLY,
        secure=settings.AUTH_COOKIE_SECURE,
        samesite=settings.AUTH_COOKIE_SAMESITE,
        path=settings.AUTH_COOKIE_PATH,
    )


from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Optional: Return JWT tokens immediately after registration
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response(
                {
                    "message": "User created successfully",
                    "access": access_token,
                    "user": {"email": user.email, "username": user.username},
                },
                status=status.HTTP_201_CREATED,
            )

            set_refresh_cookie(response, refresh)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = []

    def post(self, request):
        # Support both 'username' and 'email' keys for flexibility
        username_val = request.data.get("username") or request.data.get("email")
        password = request.data.get("password")

        if not username_val or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username_val, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response(
            {
                "access": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                },
            },
            status=status.HTTP_200_OK,
        )
        set_refresh_cookie(response, refresh)

        return response


class RefreshView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE)

        if not refresh_token:
            return Response(
                {"error": "No refresh token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"access": access_token}, status=status.HTTP_200_OK)

            # If rotation is enabled, we should set the new refresh token in the cookie
            if settings.SIMPLE_JWT.get("ROTATE_REFRESH_TOKENS", False):
                set_refresh_cookie(response, refresh)

            return response

        except TokenError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.AUTH_COOKIE, path=settings.AUTH_COOKIE_PATH)
        return response
