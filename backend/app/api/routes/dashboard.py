                                     
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.dashboard_service import get_dashboard_stats
from app.core.dependencies import require_admin_or_trainer
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin_or_trainer),
):
                                                             
    return await get_dashboard_stats(db)
