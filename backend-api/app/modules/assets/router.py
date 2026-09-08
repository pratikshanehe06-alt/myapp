from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant
from app.modules.assets.models import Asset
from app.modules.assets.schemas import AssetCreateRequest, AssetResponse
from app.modules.organization.models import Area, Site

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=list[AssetResponse])
def list_assets(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    return db.query(Asset).filter(Asset.tenant_id == tenant_id).all()


@router.post("", response_model=AssetResponse, status_code=201)
def create_asset(
    payload: AssetCreateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    area = (
        db.query(Area)
        .join(Site, Area.site_id == Site.id)
        .filter(Area.id == payload.area_id, Site.tenant_id == tenant_id)
        .first()
    )
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")

    asset = Asset(
        tenant_id=tenant_id,
        area_id=payload.area_id,
        asset_code=payload.asset_code,
        name=payload.name,
        asset_type=payload.asset_type,
        manufacturer=payload.manufacturer,
        model=payload.model,
        serial_number=payload.serial_number,
        criticality=payload.criticality,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.tenant_id == tenant_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
