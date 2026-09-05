from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class AdminUser(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoginRequest(SQLModel):
    username: str
    password: str

class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    username: str
