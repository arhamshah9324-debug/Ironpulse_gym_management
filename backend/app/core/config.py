# backend/app/core/config.py
# Central configuration — reads from environment variables / .env file

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "IronPulse Gym"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db:5432/gymdb"
    SYNC_DATABASE_URL: str = "postgresql://postgres:password@db:5432/gymdb"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"

    # Frontend
    FRONTEND_URL: str = "http://localhost:8000"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
