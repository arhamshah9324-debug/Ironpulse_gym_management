# backend/app/schemas/attendance.py
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class AttendanceBase(BaseModel):
    user_id: int
    date: date
    notes: Optional[str] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceCheckIn(BaseModel):
    user_id: int
    notes: Optional[str] = None


class AttendanceCheckOut(BaseModel):
    attendance_id: int


class AttendanceResponse(AttendanceBase):
    id: int
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    created_at: datetime
    model_config = {"from_attributes": True}
