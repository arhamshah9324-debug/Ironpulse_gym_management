# backend/app/services/dashboard_service.py
# Aggregates stats for the admin dashboard

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date

from app.models.user import User, UserRole
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.attendance import Attendance
from app.models.payment import Payment, PaymentStatus


async def get_dashboard_stats(db: AsyncSession) -> dict:
    # Total members
    total_members = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.member)
    )).scalar_one()

    # Total trainers
    total_trainers = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.trainer)
    )).scalar_one()

    # Active subscriptions
    active_subs = (await db.execute(
        select(func.count(Subscription.id)).where(Subscription.status == SubscriptionStatus.active)
    )).scalar_one()

    # Today's attendance
    today = date.today()
    today_attendance = (await db.execute(
        select(func.count(Attendance.id)).where(Attendance.date == today)
    )).scalar_one()

    # Total revenue
    total_revenue = (await db.execute(
        select(func.sum(Payment.amount)).where(Payment.status == PaymentStatus.paid)
    )).scalar_one() or 0

    # Pending payments
    pending_payments = (await db.execute(
        select(func.count(Payment.id)).where(Payment.status == PaymentStatus.pending)
    )).scalar_one()

    # Expiring subscriptions (next 7 days)
    from datetime import timedelta
    week_ahead = today + timedelta(days=7)
    expiring_soon = (await db.execute(
        select(func.count(Subscription.id)).where(
            Subscription.status == SubscriptionStatus.active,
            Subscription.end_date <= week_ahead,
            Subscription.end_date >= today,
        )
    )).scalar_one()

    return {
        "total_members": total_members,
        "total_trainers": total_trainers,
        "active_subscriptions": active_subs,
        "today_attendance": today_attendance,
        "total_revenue": float(total_revenue),
        "pending_payments": pending_payments,
        "expiring_soon": expiring_soon,
    }
