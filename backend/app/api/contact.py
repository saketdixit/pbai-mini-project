import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.config import settings
from app.core.database import get_session
from app.core.security import get_current_admin
from app.models.content import Inquiry, InquiryCreate

logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/contact", tags=["Contact & Inquiries"])

def send_notification_email(inquiry: Inquiry):
    if not settings.RESEND_API_KEY:
        logger.info(
            f"[MOCK EMAIL DISPATCH] To: {settings.INQUIRY_RECEIVER_EMAIL} | "
            f"Subject: New Tea Inquiry from {inquiry.name} ({inquiry.company or 'Direct'}) | "
            f"Type: {inquiry.inquiry_type} | Message: {inquiry.message[:50]}..."
        )
        return
    
    try:
        import resend
        resend.api_key = settings.RESEND_API_KEY
        params = {
            "from": "inquiries@resend.dev",
            "to": [settings.INQUIRY_RECEIVER_EMAIL],
            "subject": f"Aura Teas Inquiry: {inquiry.inquiry_type} - {inquiry.name}",
            "html": f"""
            <h2>New Product Inquiry Received</h2>
            <p><strong>Name:</strong> {inquiry.name}</p>
            <p><strong>Email:</strong> {inquiry.email}</p>
            <p><strong>Phone:</strong> {inquiry.phone or 'Not provided'}</p>
            <p><strong>Company:</strong> {inquiry.company or 'Not provided'}</p>
            <p><strong>Type:</strong> {inquiry.inquiry_type}</p>
            <p><strong>Product:</strong> {inquiry.product_slug or 'General Catalog'}</p>
            <p><strong>Message:</strong></p>
            <blockquote>{inquiry.message}</blockquote>
            """
        }
        resend.Emails.send(params)
    except Exception as e:
        logger.error(f"Failed to dispatch email via Resend: {e}")

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_inquiry(inquiry_data: InquiryCreate, session: Session = Depends(get_session)):
    inquiry = Inquiry.model_validate(inquiry_data)
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)
    
    # Trigger email notification
    send_notification_email(inquiry)
    
    return {
        "success": True,
        "message": "Thank you for your inquiry. Our tea sommelier team will respond within 24 hours.",
        "inquiry_id": inquiry.id
    }

@router.get("/inquiries", response_model=List[Inquiry])
def list_inquiries(
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    statement = select(Inquiry).order_by(Inquiry.created_at.desc())
    return session.exec(statement).all()
