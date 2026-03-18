# backend/app/schemas/plan.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class PlanBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_days: int
    price: Decimal
    features: Optional[str] = None
    is_active: bool = True


class PlanCreate(PlanBase):
    pass


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_days: Optional[int] = None
    price: Optional[Decimal] = None
    features: Optional[str] = None
    is_active: Optional[bool] = None


class PlanResponse(PlanBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}
