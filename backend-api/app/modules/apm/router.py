from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant
from app.modules.apm.schemas import PlantSummaryResponse, AssetHealthResponse
from app.modules.apm.service import get_plant_summary, calculate_health_score
from app.modules.assets.models import Asset

router = APIRouter(prefix="/apm", tags=["apm"])


@router.get("/dashboard/summary", response_model=PlantSummaryResponse)
def dashboard_summary(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    return get_plant_summary(db, tenant_id)


@router.get("/assets/health", response_model=list[AssetHealthResponse])
def assets_health(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    assets = db.query(Asset).filter(Asset.tenant_id == tenant_id).all()
    return [
        AssetHealthResponse(
            asset_id=a.id,
            asset_name=a.name,
            status=a.status,
            health_score=calculate_health_score(db, a),
            criticality=a.criticality,
        )
        for a in assets
    ]
