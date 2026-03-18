# backend/app/models/__init__.py
# Import all models here so Alembic autogenerate can discover them

from app.models.user import User, UserRole
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.plan import Plan
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.attendance import Attendance
from app.models.payment import Payment, PaymentStatus, PaymentMethod

__all__ = [
    "User", "UserRole",
    "Member",
    "Trainer",
    "Plan",
    "Subscription", "SubscriptionStatus",
    "Attendance",
    "Payment", "PaymentStatus", "PaymentMethod",
]
