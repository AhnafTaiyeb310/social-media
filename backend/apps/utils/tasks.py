import time
import logging
from django.conf import settings
from celery import shared_task
import os

logger = logging.getLogger(__name__)

@shared_task
def purge_old_tmp_files():
    """
    Cleans up files in MEDIA_ROOT/tmp/ that are older than 24 hours.
    Acts as a safety net for failed uploads or abandoned temp files.
    """
    tmp_dir = os.path.join(settings.MEDIA_ROOT, 'tmp')
    
    if not os.path.exists(tmp_dir):
        return f"Directory {tmp_dir} does not exist. Skipping."

    now = time.time()
    one_day_ago = now - 86400  # 24 hours in seconds
    deleted_count = 0

    for filename in os.listdir(tmp_dir):
        file_path = os.path.join(tmp_dir, filename)
        
        try:
            if os.path.isfile(file_path):
                # Check file modification time
                if os.stat(file_path).st_mtime < one_day_ago:
                    os.remove(file_path)
                    deleted_count += 1
        except Exception as e:
            logger.error(f"Failed to delete {file_path}: {e}")

    return f"Cleanup complete: {deleted_count} files purged."