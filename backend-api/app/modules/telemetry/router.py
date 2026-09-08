from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant
from app.modules.telemetry.models import TelemetryReading
from app.modules.telemetry.schemas import LatestReadingResponse, TelemetryReadingResponse
from app.modules.assets.models import Asset
from app.modules.tags.models import Tag

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.get("/assets/{asset_id}/latest", response_model=list[LatestReadingResponse])
def get_latest_readings(
    asset_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.tenant_id == tenant_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    tags = db.query(Tag).filter(Tag.asset_id == asset_id).all()
    results = []
    for tag in tags:
        latest = (
            db.query(TelemetryReading)
            .filter(TelemetryReading.tag_id == tag.id)
            .order_by(TelemetryReading.timestamp.desc())
            .first()
        )
        if latest:
            results.append(
                LatestReadingResponse(
                    tag_id=tag.id,
                    tag_name=tag.tag_name,
                    unit=tag.unit,
                    value=latest.value,
                    quality=latest.quality,
                )
            )
    return results


@router.get("/tags/{tag_id}/history", response_model=list[TelemetryReadingResponse])
def get_tag_history(
    tag_id: int,
    limit: int = 50,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    readings = (
        db.query(TelemetryReading)
        .filter(TelemetryReading.tag_id == tag_id, TelemetryReading.tenant_id == tenant_id)
        .order_by(TelemetryReading.timestamp.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(readings))
