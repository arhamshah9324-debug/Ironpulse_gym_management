# backend/app/services/member_service.py
# CRUD operations for Member profiles

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate


async def get_all_members(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Member).offset(skip).limit(limit))
    return result.scalars().all()


async def get_member_by_id(db: AsyncSession, member_id: int) -> Member:
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found")
    return member


async def get_member_by_user_id(db: AsyncSession, user_id: int) -> Member:
    result = await db.execute(select(Member).where(Member.user_id == user_id))
    return result.scalar_one_or_none()


async def create_member(db: AsyncSession, data: MemberCreate) -> Member:
    existing = await get_member_by_user_id(db, data.user_id)
    if existing:
        raise HTTPException(status_code=400, detail="Member profile already exists for this user")
    member = Member(**data.model_dump())
    db.add(member)
    await db.flush()
    await db.refresh(member)
    return member


async def update_member(db: AsyncSession, member_id: int, data: MemberUpdate) -> Member:
    member = await get_member_by_id(db, member_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    await db.flush()
    await db.refresh(member)
    return member


async def delete_member(db: AsyncSession, member_id: int) -> dict:
    member = await get_member_by_id(db, member_id)
    await db.delete(member)
    return {"detail": "Member deleted"}
