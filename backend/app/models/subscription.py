# backend/app/models/subscription.py
# Subscription — links a member to a plan with start/end dates

from sqlalchemy import Column, Integer, ForeignKey, Date, Enum as SAEnum, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"
    pending = "pending"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id", ondelete="CASCADE"))
    plan_id = Column(Integer, ForeignKey("plans.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(
        SAEnum(SubscriptionStatus),
        default=SubscriptionStatus.pending,
        nullable=False,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    member = relationship("Member", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")
    payment = relationship("Payment", back_populates="subscription", uselist=False)
