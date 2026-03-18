# backend/app/api/routes/subscriptions.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate, SubscriptionResponse
from app.services import subscription_service
from app.core.dependencies import require_admin_or_trainer, get_current_user
from app.models.user import User

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.get("/", response_model=List[SubscriptionResponse])
async def list_subscriptions(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await subscription_service.get_all_subscriptions(db, skip, limit)


@router.get("/member/{member_id}", response_model=List[SubscriptionResponse])
async def member_subscriptions(
    member_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await subscription_service.get_member_subscriptions(db, member_id)


@router.get("/{sub_id}", response_model=SubscriptionResponse)
async def get_subscription(sub_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await subscription_service.get_subscription_by_id(db, sub_id)


@router.post("/", response_model=SubscriptionResponse, status_code=201)
async def create_subscription(data: SubscriptionCreate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    return await subscription_service.create_subscription(db, data)


@router.put("/{sub_id}", response_model=SubscriptionResponse)
async def update_subscription(sub_id: int, data: SubscriptionUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    return await subscription_service.update_subscription(db, sub_id, data)


@router.post("/expire-check")
async def run_expiry_check(db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    """Manually trigger subscription expiry check."""
    count = await subscription_service.auto_expire_subscriptions(db)
    return {"expired": count}
