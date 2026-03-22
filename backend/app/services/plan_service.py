                                      
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.plan import Plan
from app.schemas.plan import PlanCreate, PlanUpdate


async def get_all_plans(db: AsyncSession, active_only: bool = False):
    query = select(Plan)
    if active_only:
        query = query.where(Plan.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()


async def get_plan_by_id(db: AsyncSession, plan_id: int) -> Plan:
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    return plan


async def create_plan(db: AsyncSession, data: PlanCreate) -> Plan:
    plan = Plan(**data.model_dump())
    db.add(plan)
    await db.flush()
    await db.refresh(plan)
    return plan


async def update_plan(db: AsyncSession, plan_id: int, data: PlanUpdate) -> Plan:
    plan = await get_plan_by_id(db, plan_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(plan, field, value)
    await db.flush()
    await db.refresh(plan)
    return plan


async def delete_plan(db: AsyncSession, plan_id: int) -> dict:
    plan = await get_plan_by_id(db, plan_id)
    await db.delete(plan)
    return {"detail": "Plan deleted"}
