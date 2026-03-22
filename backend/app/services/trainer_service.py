                                         
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.trainer import Trainer
from app.schemas.trainer import TrainerCreate, TrainerUpdate


async def get_all_trainers(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Trainer).options(selectinload(Trainer.user)).offset(skip).limit(limit))
    return result.scalars().all()


async def get_trainer_by_id(db: AsyncSession, trainer_id: int) -> Trainer:
    result = await db.execute(select(Trainer).options(selectinload(Trainer.user)).where(Trainer.id == trainer_id))
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer not found")
    return trainer


async def get_trainer_by_user_id(db: AsyncSession, user_id: int) -> Trainer:
    result = await db.execute(select(Trainer).options(selectinload(Trainer.user)).where(Trainer.user_id == user_id))
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trainer profile not found for this user")
    return trainer


async def create_trainer(db: AsyncSession, data: TrainerCreate) -> Trainer:
    result = await db.execute(select(Trainer).where(Trainer.user_id == data.user_id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Trainer profile already exists for this user")
    trainer = Trainer(**data.model_dump())
    db.add(trainer)
    await db.flush()
    return await get_trainer_by_id(db, trainer.id)


async def update_trainer(db: AsyncSession, trainer_id: int, data: TrainerUpdate) -> Trainer:
    trainer = await get_trainer_by_id(db, trainer_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(trainer, field, value)
    await db.flush()
    return await get_trainer_by_id(db, trainer.id)


async def delete_trainer(db: AsyncSession, trainer_id: int) -> dict:
    trainer = await get_trainer_by_id(db, trainer_id)
    await db.delete(trainer)
    return {"detail": "Trainer deleted"}
