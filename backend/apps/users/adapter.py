from allauth.headless.adapter import DefaultHeadlessAdapter
from allauth.account.utils import user_field
from .serializers import UserSerializer

class CustomHeadlessAdapter(DefaultHeadlessAdapter):
    """
    Staff-level Headless Adapter to ensure responses are enriched with 
    the full User object and session state in a single payload.
    """
    
    def get_user_data(self, request, user):
        """
        Enriches the standard response with our UserSerializer data.
        """
        serializer = UserSerializer(user)
        return serializer.data

    def serialize_session(self, request, session):
        """
        Ensures session data is returned in a standardized JSON format.
        """
        data = super().serialize_session(request, session)
        # We can add more specific session metadata here if needed
        return data
