# backend/app/api/routes/plans.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.plan import PlanCreate, PlanUpdate, PlanResponse
from app.services import plan_service
from app.core.dependencies import require_admin, get_current_user
from app.models.user import User

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/", response_model=List[PlanResponse])
async def list_plans(
    active_only: bool = False,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await plan_service.get_all_plans(db, active_only)


@router.get("/{plan_id}", response_model=PlanResponse)
async def get_plan(plan_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    return await plan_service.get_plan_by_id(db, plan_id)


@router.post("/", response_model=PlanResponse, status_code=201)
async def create_plan(data: PlanCreate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await plan_service.create_plan(db, data)


@router.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(plan_id: int, data: PlanUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await plan_service.update_plan(db, plan_id, data)


@router.delete("/{plan_id}")
async def delete_plan(plan_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    return await plan_service.delete_plan(db, plan_id)
