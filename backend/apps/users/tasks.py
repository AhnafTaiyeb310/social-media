from celery import shared_task
from cloudinary.uploader import upload
import os
import time
from .models import Profile

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def upload_profile_pic_task(self, profile_id, file_path):
    """
    Uploads a profile picture to Cloudinary asynchronously.
    """
    try:    
        profile = Profile.objects.get(id=profile_id)
        
        # Upload the local temp file to Cloudinary
        result = upload(file_path, folder="users/avatars/")

        # Update the CharField with the public_id
        profile.profile_picture = result['public_id']
        profile.save()

        # Clean up the local temp file
        time.sleep(1)
        if os.path.exists(file_path):
            os.remove(file_path)
            
    except Exception as exc:
        if self.request.retries == self.max_retries:
            if os.path.exists(file_path):
                os.remove(file_path)
        raise exc
