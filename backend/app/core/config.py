from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Aura Artisanal Teas API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    DATABASE_URL: str = "sqlite:///./tea_showcase.db"
    
    SECRET_KEY: str = "tea-brand-jwt-secret-key-change-in-production-random-hash-928471"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    ADMIN_USERNAME: str = "admin"
    ADMIN_INITIAL_PASSWORD: str = "AuraTeaAdmin2026!"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://*.pages.dev",
    ]
    
    RESEND_API_KEY: Optional[str] = None
    INQUIRY_RECEIVER_EMAIL: str = "inquiries@aurateas.example.com"
    UPLOAD_DIR: str = "uploads"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
