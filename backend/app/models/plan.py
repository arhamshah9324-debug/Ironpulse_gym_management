# backend/app/models/plan.py
# Subscription plan — defines available gym membership tiers

from sqlalchemy import Column, Integer, String, Numeric, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class Plan(Base):
    __tablename__ = "plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    duration_days = Column(Integer, nullable=False)   # e.g. 30, 90, 365
    price = Column(Numeric(10, 2), nullable=False)
    features = Column(Text, nullable=True)            # Comma-separated feature list
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    subscriptions = relationship("Subscription", back_populates="plan")
