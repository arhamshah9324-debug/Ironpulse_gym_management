# backend/app/schemas/member.py
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class MemberBase(BaseModel):
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    profile_notes: Optional[str] = None
    join_date: Optional[date] = None


class MemberCreate(MemberBase):
    user_id: int


class MemberUpdate(MemberBase):
    pass


class MemberResponse(MemberBase):
    id: int
    user_id: int
    created_at: datetime
    model_config = {"from_attributes": True}
