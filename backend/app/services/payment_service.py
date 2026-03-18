# backend/app/services/payment_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from datetime import datetime, timezone

from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import PaymentCreate, PaymentUpdate


async def get_all_payments(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(Payment).order_by(Payment.created_at.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()


async def get_payment_by_id(db: AsyncSession, payment_id: int) -> Payment:
    result = await db.execute(select(Payment).where(Payment.id == payment_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return p


async def get_payments_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Payment).where(Payment.user_id == user_id).order_by(Payment.created_at.desc())
    )
    return result.scalars().all()


async def create_payment(db: AsyncSession, data: PaymentCreate) -> Payment:
    payment = Payment(**data.model_dump())
    db.add(payment)
    await db.flush()
    await db.refresh(payment)
    return payment


async def update_payment(db: AsyncSession, payment_id: int, data: PaymentUpdate) -> Payment:
    payment = await get_payment_by_id(db, payment_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(payment, field, value)
    # Auto-set paid_at when status becomes paid
    if data.status == PaymentStatus.paid and not payment.paid_at:
        payment.paid_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(payment)
    return payment


async def get_total_revenue(db: AsyncSession) -> float:
    result = await db.execute(
        select(func.sum(Payment.amount)).where(Payment.status == PaymentStatus.paid)
    )
    return float(result.scalar_one() or 0)
