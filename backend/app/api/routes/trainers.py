# backend/app/api/routes/trainers.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.trainer import TrainerCreate, TrainerUpdate, TrainerResponse
from app.services import trainer_service
from app.core.dependencies import require_admin, get_current_user
from app.models.user import User

router = APIRouter(prefix="/trainers", tags=["Trainers"])


@router.get("/", response_model=List[TrainerResponse])
async def list_trainers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await trainer_service.get_all_trainers(db, skip, limit)


@router.get("/{trainer_id}", response_model=TrainerResponse)
async def get_trainer(
    trainer_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await trainer_service.get_trainer_by_id(db, trainer_id)


@router.post("/", response_model=TrainerResponse, status_code=201)
async def create_trainer(
    data: TrainerCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    return await trainer_service.create_trainer(db, data)


@router.put("/{trainer_id}", response_model=TrainerResponse)
async def update_trainer(
    trainer_id: int,
    data: TrainerUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    return await trainer_service.update_trainer(db, trainer_id, data)


@router.delete("/{trainer_id}")
async def delete_trainer(
    trainer_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    return await trainer_service.delete_trainer(db, trainer_id)
