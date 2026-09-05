from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Column, JSON

class ProductBase(SQLModel):
    name: str
    slug: str = Field(unique=True, index=True)
    category: str = Field(index=True) # Black Tea, Green Tea, White Tea, Oolong, Herbal / Tisane
    origin: str # e.g. "Makaibari Estate, Darjeeling (5,200 ft)"
    flush: Optional[str] = None # e.g. "First Flush 2026", "Spring Picked"
    grade: Optional[str] = None # e.g. "FTGFOP1", "Handcrafted Silver Needle"
    short_description: str
    description: str
    flavor_notes: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    brewing_guide: Dict[str, Any] = Field(
        default_factory=lambda: {
            "temp": "85°C / 185°F",
            "steep_time": "3 mins",
            "ratio": "2.5g per 200ml",
            "infusions": 3
        },
        sa_column=Column(JSON)
    )
    image_url: str
    is_featured: bool = False
    display_order: int = 0
    is_available: bool = True

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(SQLModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    origin: Optional[str] = None
    flush: Optional[str] = None
    grade: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    flavor_notes: Optional[List[str]] = None
    brewing_guide: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    is_available: Optional[bool] = None
