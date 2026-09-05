from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import verify_password, create_access_token, get_current_admin
from app.models.admin import AdminUser, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, session: Session = Depends(get_session)):
    statement = select(AdminUser).where(AdminUser.username == login_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        username=user.username
    )

@router.get("/me")
def get_current_user_profile(admin_payload: dict = Depends(get_current_admin)):
    return {
        "username": admin_payload.get("sub"),
        "role": "admin",
        "authenticated": True
    }
