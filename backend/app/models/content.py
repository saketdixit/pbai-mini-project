from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON

class SiteContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True, default="about")
    title: str = "Our Heritage & Terroir Philosophy"
    headline: str = "From the Mist-Veiled Slopes to the Refined Cup"
    story: str # Main rich text / markdown narrative
    values: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    contact_info: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteContentUpdate(SQLModel):
    title: Optional[str] = None
    headline: Optional[str] = None
    story: Optional[str] = None
    values: Optional[Dict[str, Any]] = None
    contact_info: Optional[Dict[str, Any]] = None

class Inquiry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    inquiry_type: str = "Wholesale & Export" # Wholesale & Export, Sample Tasting Kit, Private Label, General
    product_slug: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InquiryCreate(SQLModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    inquiry_type: Optional[str] = "Wholesale & Export"
    product_slug: Optional[str] = None
    message: str
