import os
import uuid
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status

from app.core.config import settings
from app.core.security import get_current_admin

router = APIRouter(prefix="/upload", tags=["Media Upload"])

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
}

@router.post("", response_model=dict)
def upload_product_image(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_admin)
):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: JPG, PNG, WEBP, AVIF."
        )
    
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    extension = ALLOWED_MIME_TYPES[file.content_type]
    unique_filename = f"tea_{uuid.uuid4().hex[:12]}{extension}"
    target_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save uploaded file: {str(e)}"
        )
        
    return {
        "url": f"/uploads/{unique_filename}",
        "filename": unique_filename,
        "content_type": file.content_type
    }
