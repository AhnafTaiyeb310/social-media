import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing consumers and routing.
django_asgi_app = get_asgi_application()

# Import routing and middleware AFTER get_asgi_application()
from channels.routing import ProtocolTypeRouter, URLRouter
from apps.chat.middleware import JWTAuthMiddlewareStack
import apps.chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            apps.chat.routing.websocket_urlpatterns
        )
    ),
})