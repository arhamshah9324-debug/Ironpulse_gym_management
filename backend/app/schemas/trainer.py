# backend/app/schemas/trainer.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.schemas.user import UserResponse


class TrainerBase(BaseModel):
    phone: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    experience_years: Optional[int] = 0
    hourly_rate: Optional[Decimal] = None
    certifications: Optional[str] = None


class TrainerCreate(TrainerBase):
    user_id: int


class TrainerUpdate(TrainerBase):
    pass


class TrainerResponse(TrainerBase):
    id: int
    user_id: int
    created_at: datetime
    user: UserResponse
    model_config = {"from_attributes": True}
