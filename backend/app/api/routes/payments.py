                                    
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.db.session import get_db
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentResponse
from app.services import payment_service
from app.core.dependencies import require_admin, require_admin_or_trainer, get_current_user
from app.models.user import User

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/", response_model=List[PaymentResponse])
async def list_payments(
    skip: int = 0, limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
    return await payment_service.get_all_payments(db, skip, limit)


@router.get("/user/{user_id}", response_model=List[PaymentResponse])
async def user_payments(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return await payment_service.get_payments_by_user(db, user_id)


@router.get("/revenue/total")
async def total_revenue(db: AsyncSession = Depends(get_db), _: User = Depends(require_admin)):
    revenue = await payment_service.get_total_revenue(db)
    return {"total_revenue": revenue}


@router.get("/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: int, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    return await payment_service.get_payment_by_id(db, payment_id)


@router.post("/", response_model=PaymentResponse, status_code=201)
async def create_payment(data: PaymentCreate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    return await payment_service.create_payment(db, data)


@router.put("/{payment_id}", response_model=PaymentResponse)
async def update_payment(payment_id: int, data: PaymentUpdate, db: AsyncSession = Depends(get_db), _: User = Depends(require_admin_or_trainer)):
    return await payment_service.update_payment(db, payment_id, data)
