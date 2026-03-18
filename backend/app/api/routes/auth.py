# backend/app/api/routes/auth.py
# Authentication endpoints: signup, login (JWT), Google OAuth

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import create_user, authenticate_user, google_oauth_login
from app.core.security import create_access_token
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User
import urllib.parse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user and return a JWT token."""
    user = await create_user(db, user_data)
    token = create_access_token(subject=user.id, role=user.role.value)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login with email/password and receive a JWT token."""
    user = await authenticate_user(db, credentials.email, credentials.password)
    token = create_access_token(subject=user.id, role=user.role.value)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Return profile of the currently authenticated user."""
    return current_user


@router.get("/google")
async def google_login():
    """Redirect to Google OAuth consent screen."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    params = urllib.parse.urlencode({
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback — exchange code for user session."""
    user = await google_oauth_login(db, code)
    token = create_access_token(subject=user.id, role=user.role.value)
    # Redirect to frontend with token in query param (frontend stores it)
    redirect_url = f"{settings.FRONTEND_URL}/dashboard.html?token={token}"
    return RedirectResponse(redirect_url)
