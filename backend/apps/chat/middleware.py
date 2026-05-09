from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model
from django.conf import settings
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Extract cookies from headers
        headers = dict(scope.get('headers', {}))
        cookie_header = headers.get(b'cookie', b'').decode()
        
        cookies = {}
        if cookie_header:
            for cookie in cookie_header.split(';'):
                if '=' in cookie:
                    key, value = cookie.split('=', 1)
                    cookies[key.strip()] = value.strip()

        token = cookies.get('access')

        if token:
            try:
                # Validates the token and its signature
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                scope['user'] = await get_user(user_id)
            except (TokenError, InvalidToken) as e:
                logger.error(f"JWT Token Error: {e}")
                scope['user'] = AnonymousUser()
            except Exception as e:
                logger.error(f"JWT Auth Middleware Error: {e}")
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await self.inner(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(inner)
