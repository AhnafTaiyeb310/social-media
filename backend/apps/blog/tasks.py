from celery import shared_task
from cloudinary.uploader import upload
import os
from .models import PostImages

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=True, max_retries=3)
def upload_post_image_task(self, post_image_id, file_path):
    """
    Uploads a post image to Cloudinary asynchronously.
    """
    try:
        # Get the specific image instance
        post_image = PostImages.objects.get(id=post_image_id)
        
        # Upload the local temp file to Cloudinary
        result = upload(file_path, folder="blog/images/")
        
        # Update the CharField with the public_id
        post_image.image = result['public_id']
        post_image.save()

        # Clean up the local temp file
        if os.path.exists(file_path):
            os.remove(file_path)
            
    except Exception as exc:
        # If this is the final retry, clean up the temp file anyway
        if self.request.retries == self.max_retries:
            if os.path.exists(file_path):
                os.remove(file_path)
        raise exc
