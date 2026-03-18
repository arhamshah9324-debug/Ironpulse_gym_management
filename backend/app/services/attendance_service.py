# backend/app/services/attendance_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from datetime import date, datetime, timezone

from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCheckIn


async def check_in(db: AsyncSession, data: AttendanceCheckIn) -> Attendance:
    """Record a check-in for today. Prevents duplicate check-ins."""
    today = date.today()
    result = await db.execute(
        select(Attendance).where(
            Attendance.user_id == data.user_id,
            Attendance.date == today,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")

    record = Attendance(
        user_id=data.user_id,
        date=today,
        check_in=datetime.now(timezone.utc),
        notes=data.notes,
    )
    db.add(record)
    await db.flush()
    await db.refresh(record)
    return record


async def check_out(db: AsyncSession, attendance_id: int) -> Attendance:
    """Record check-out time on an existing attendance record."""
    result = await db.execute(select(Attendance).where(Attendance.id == attendance_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    if record.check_out:
        raise HTTPException(status_code=400, detail="Already checked out")
    record.check_out = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(record)
    return record


async def get_attendance_by_user(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 50):
    result = await db.execute(
        select(Attendance)
        .where(Attendance.user_id == user_id)
        .order_by(Attendance.date.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


async def get_all_attendance(db: AsyncSession, filter_date: date = None, skip: int = 0, limit: int = 100):
    query = select(Attendance).order_by(Attendance.date.desc())
    if filter_date:
        query = query.where(Attendance.date == filter_date)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


async def get_today_count(db: AsyncSession) -> int:
    today = date.today()
    result = await db.execute(
        select(func.count(Attendance.id)).where(Attendance.date == today)
    )
    return result.scalar_one()
