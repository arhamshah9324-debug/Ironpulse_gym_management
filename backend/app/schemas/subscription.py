# backend/app/schemas/subscription.py
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from app.models.subscription import SubscriptionStatus


class SubscriptionBase(BaseModel):
    member_id: int
    plan_id: int
    start_date: date
    end_date: date
    status: SubscriptionStatus = SubscriptionStatus.pending


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    status: Optional[SubscriptionStatus] = None
    end_date: Optional[date] = None


class SubscriptionResponse(SubscriptionBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
