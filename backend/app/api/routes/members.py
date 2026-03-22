                                   
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse
from app.services import member_service
from app.core.dependencies import require_admin_or_trainer, get_current_user
from app.models.user import User

router = APIRouter(prefix="/members", tags=["Members"])


@router.get("/me", response_model=MemberResponse)
async def get_my_member_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    member = await member_service.get_member_by_user_id(db, current_user.id)
    if not member:
        raise HTTPException(status_code=404, detail="Member profile not found for this user")
    return member


@router.get("/", response_model=List[MemberResponse])
async def list_members(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await member_service.get_all_members(db, skip, limit)


@router.get("/{member_id}", response_model=MemberResponse)
async def get_member(
    member_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await member_service.get_member_by_id(db, member_id)


@router.post("/", response_model=MemberResponse, status_code=201)
async def create_member(
    data: MemberCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await member_service.create_member(db, data)


@router.put("/{member_id}", response_model=MemberResponse)
async def update_member(
    member_id: int,
    data: MemberUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await member_service.update_member(db, member_id, data)


@router.delete("/{member_id}")
async def delete_member(
    member_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await member_service.delete_member(db, member_id)
