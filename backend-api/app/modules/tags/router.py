from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant
from app.modules.tags.models import Tag
from app.modules.tags.schemas import TagCreateRequest, TagResponse
from app.modules.assets.models import Asset

router = APIRouter(prefix="/assets", tags=["tags"])


@router.get("/{asset_id}/tags", response_model=list[TagResponse])
def list_tags(
    asset_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.tenant_id == tenant_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return db.query(Tag).filter(Tag.asset_id == asset_id).all()


@router.post("/{asset_id}/tags", response_model=TagResponse, status_code=201)
def create_tag(
    asset_id: int,
    payload: TagCreateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.tenant_id == tenant_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    tag = Tag(asset_id=asset_id, **payload.model_dump())
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag
