# backend/app/services/auth_service.py
# Business logic for authentication: signup, login, Google OAuth token exchange

from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import httpx

from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    """Register a new user with hashed password."""
    # Check for duplicate email
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role=user_data.role,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    """Verify email/password and return user."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )
    return user


async def get_google_user_info(code: str) -> dict:
    """Exchange Google OAuth code for user profile data."""
    async with httpx.AsyncClient() as client:
        # Exchange code for tokens
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        token_data = token_resp.json()
        if "error" in token_data:
            raise HTTPException(status_code=400, detail=token_data.get("error_description", "Google OAuth failed"))

        access_token = token_data["access_token"]

        # Fetch user profile
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        return user_resp.json()


async def google_oauth_login(db: AsyncSession, code: str) -> User:
    """Login or register user via Google OAuth."""
    profile = await get_google_user_info(code)
    google_id = profile.get("id")
    email = profile.get("email")
    name = profile.get("name", email)
    avatar_url = profile.get("picture")

    # Check existing by google_id
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Check if email exists (link accounts)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if user:
        # Update OAuth info
        user.google_id = google_id
        user.avatar_url = avatar_url
        await db.flush()
    else:
        # Create new user via Google
        user = User(
            name=name,
            email=email,
            google_id=google_id,
            avatar_url=avatar_url,
            role=UserRole.member,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)

    return user
