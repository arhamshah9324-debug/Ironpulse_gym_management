                                           
                                          

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import date, datetime, timedelta
from typing import Dict, Any

from app.models.user import User, UserRole
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.attendance import Attendance
from app.models.payment import Payment, PaymentStatus


async def get_dashboard_stats(db: AsyncSession) -> dict:
                   
    total_members = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.member)
    )).scalar_one()

                    
    total_trainers = (await db.execute(
        select(func.count(User.id)).where(User.role == UserRole.trainer)
    )).scalar_one()

                          
    active_subs = (await db.execute(
        select(func.count(Subscription.id)).where(Subscription.status == SubscriptionStatus.active)
    )).scalar_one()

                        
    today = date.today()
    today_attendance = (await db.execute(
        select(func.count(Attendance.id)).where(Attendance.date == today)
    )).scalar_one()

                   
    total_revenue = (await db.execute(
        select(func.sum(Payment.amount)).where(Payment.status == PaymentStatus.paid)
    )).scalar_one() or 0

                      
    pending_payments = (await db.execute(
        select(func.count(Payment.id)).where(Payment.status == PaymentStatus.pending)
    )).scalar_one()

                                          
    from datetime import timedelta
    week_ahead = today + timedelta(days=7)
    expiring_soon = (await db.execute(
        select(func.count(Subscription.id)).where(
            Subscription.status == SubscriptionStatus.active,
            Subscription.end_date <= week_ahead,
            Subscription.end_date >= today,
        )
    )).scalar_one()

                                          
    seven_days_ago = today - timedelta(days=6)
    attendances = (await db.execute(
        select(Attendance.date, func.count(Attendance.id))
        .where(Attendance.date >= seven_days_ago)
        .group_by(Attendance.date)
    )).all()
    
    attendance_map = {d: count for d, count in attendances}
    attendance_trend = []
    for i in range(7):
        d = seven_days_ago + timedelta(days=i)
        attendance_trend.append({
            "day": d.strftime("%a"),
            "visits": attendance_map.get(d, 0)
        })

                                
    recent_activity = []
    
    recent_payments = (await db.execute(
        select(Payment).order_by(Payment.paid_at.desc()).limit(5)
    )).scalars().all()
    for p in recent_payments:
        recent_activity.append({
            "id": f"pay_{p.id}",
            "action": f"Payment received: ₹{p.amount:,.0f}",
            "time": p.paid_at.isoformat() if p.paid_at else "",
            "type": "payment",
            "sort_key": p.paid_at or datetime.min
        })

    recent_subs = (await db.execute(
        select(Subscription).order_by(Subscription.created_at.desc()).limit(5)
    )).scalars().all()
    for s in recent_subs:
        recent_activity.append({
            "id": f"sub_{s.id}",
            "action": "New subscription triggered",
            "time": s.created_at.isoformat() if s.created_at else "",
            "type": "member",
            "sort_key": s.created_at or datetime.min
        })
        
    recent_trainers = (await db.execute(
        select(Trainer).order_by(Trainer.created_at.desc()).limit(3)
    )).scalars().all()
    for t in recent_trainers:
        recent_activity.append({
            "id": f"trn_{t.id}",
            "action": "New trainer registered",
            "time": t.created_at.isoformat() if t.created_at else "",
            "type": "trainer",
            "sort_key": t.created_at or datetime.min
        })

    recent_activity.sort(key=lambda x: x["sort_key"].replace(tzinfo=None) if hasattr(x["sort_key"], 'replace') else x["sort_key"], reverse=True)
    recent_activity = recent_activity[:5]

    return {
        "total_members": total_members,
        "total_trainers": total_trainers,
        "active_subscriptions": active_subs,
        "today_attendance": today_attendance,
        "total_revenue": float(total_revenue),
        "pending_payments": pending_payments,
        "expiring_soon": expiring_soon,
        "attendance_trend": attendance_trend,
        "recent_activity": recent_activity
    }
