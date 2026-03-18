# backend/app/services/subscription_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import date

from app.models.subscription import Subscription, SubscriptionStatus
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate


async def get_all_subscriptions(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Subscription).offset(skip).limit(limit))
    return result.scalars().all()


async def get_subscription_by_id(db: AsyncSession, sub_id: int) -> Subscription:
    result = await db.execute(select(Subscription).where(Subscription.id == sub_id))
    sub = result.scalar_one_or_none()
    if not sub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return sub


async def get_member_subscriptions(db: AsyncSession, member_id: int):
    result = await db.execute(
        select(Subscription).where(Subscription.member_id == member_id)
    )
    return result.scalars().all()


async def create_subscription(db: AsyncSession, data: SubscriptionCreate) -> Subscription:
    sub = Subscription(**data.model_dump())
    db.add(sub)
    await db.flush()
    await db.refresh(sub)
    return sub


async def update_subscription(db: AsyncSession, sub_id: int, data: SubscriptionUpdate) -> Subscription:
    sub = await get_subscription_by_id(db, sub_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(sub, field, value)
    await db.flush()
    await db.refresh(sub)
    return sub


async def auto_expire_subscriptions(db: AsyncSession):
    """Mark past-end-date active subscriptions as expired."""
    today = date.today()
    result = await db.execute(
        select(Subscription).where(
            Subscription.end_date < today,
            Subscription.status == SubscriptionStatus.active,
        )
    )
    subs = result.scalars().all()
    for sub in subs:
        sub.status = SubscriptionStatus.expired
    await db.flush()
    return len(subs)
