                                      
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date

from app.db.session import get_db
from app.schemas.attendance import AttendanceCheckIn, AttendanceCheckOut, AttendanceResponse
from app.services import attendance_service
from app.core.dependencies import require_admin_or_trainer, get_current_user
from app.models.user import User

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.get("/", response_model=List[AttendanceResponse])
async def list_attendance(
    filter_date: Optional[date] = Query(None),
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await attendance_service.get_all_attendance(db, filter_date, skip, limit)


@router.get("/user/{user_id}", response_model=List[AttendanceResponse])
async def user_attendance(
    user_id: int, skip: int = 0, limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await attendance_service.get_attendance_by_user(db, user_id, skip, limit)


@router.get("/today/count")
async def today_count(db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    count = await attendance_service.get_today_count(db)
    return {"date": date.today(), "count": count}


@router.post("/checkin", response_model=AttendanceResponse, status_code=201)
async def check_in(
    data: AttendanceCheckIn,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await attendance_service.check_in(db, data)


@router.post("/checkout")
async def check_out(
    data: AttendanceCheckOut,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await attendance_service.check_out(db, data.attendance_id)
