from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        # Point to the Next.js frontend verification route
        return f"{settings.FRONTEND_URL}/verify-email/{emailconfirmation.key}"
