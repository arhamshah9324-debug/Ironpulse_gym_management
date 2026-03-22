                                
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.models.payment import PaymentStatus, PaymentMethod


class PaymentBase(BaseModel):
    user_id: int
    amount: Decimal
    method: PaymentMethod = PaymentMethod.cash
    subscription_id: Optional[int] = None
    transaction_id: Optional[str] = None
    notes: Optional[str] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    transaction_id: Optional[str] = None
    notes: Optional[str] = None
    paid_at: Optional[datetime] = None


class PaymentResponse(PaymentBase):
    id: int
    status: PaymentStatus
    paid_at: Optional[datetime] = None
    created_at: datetime
    model_config = {"from_attributes": True}
