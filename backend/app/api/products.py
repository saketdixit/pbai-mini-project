from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, col

from app.core.database import get_session
from app.core.security import get_current_admin
from app.models.product import Product, ProductCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[Product])
def list_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    q: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Product)
    if category and category.lower() != "all":
        query = query.where(col(Product.category).ilike(f"%{category}%"))
    if featured is not None:
        query = query.where(Product.is_featured == featured)
    if q:
        search_filter = f"%{q}%"
        query = query.where(
            col(Product.name).ilike(search_filter)
            | col(Product.origin).ilike(search_filter)
            | col(Product.short_description).ilike(search_filter)
        )
    
    query = query.order_by(Product.display_order.asc(), Product.id.asc())
    return session.exec(query).all()

@router.get("/{slug}", response_model=Product)
def get_product_by_slug(slug: str, session: Session = Depends(get_session)):
    statement = select(Product).where(Product.slug == slug)
    product = session.exec(statement).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found"
        )
    return product

@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    existing = session.exec(select(Product).where(Product.slug == product_data.slug)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with slug '{product_data.slug}' already exists"
        )
    
    product = Product.model_validate(product_data)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    update_data: ProductUpdate,
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    if "slug" in update_dict and update_dict["slug"] != product.slug:
        existing = session.exec(select(Product).where(Product.slug == update_dict["slug"])).first()
        if existing and existing.id != product_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slug '{update_dict['slug']}' is already in use by another product"
            )
            
    for key, value in update_dict.items():
        setattr(product, key, value)
        
    session.add(product)
    session.commit()
    session.refresh(product)
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    session.delete(product)
    session.commit()
    return None

@router.put("/batch/reorder", response_model=List[Product])
def reorder_products(
    order_data: List[dict], # [{"id": 1, "display_order": 0}, {"id": 2, "display_order": 1}]
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    for item in order_data:
        p_id = item.get("id")
        p_order = item.get("display_order")
        if p_id is not None and p_order is not None:
            product = session.get(Product, p_id)
            if product:
                product.display_order = p_order
                session.add(product)
    session.commit()
    return session.exec(select(Product).order_by(Product.display_order.asc())).all()
