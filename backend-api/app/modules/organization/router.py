from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant
from app.modules.organization.models import Site, Area
from app.modules.organization.schemas import (
    SiteCreateRequest,
    SiteResponse,
    AreaCreateRequest,
    AreaResponse,
)

router = APIRouter(prefix="/org", tags=["organization"])


@router.get("/sites", response_model=list[SiteResponse])
def list_sites(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    return db.query(Site).filter(Site.tenant_id == tenant_id).all()


@router.post("/sites", response_model=SiteResponse, status_code=201)
def create_site(
    payload: SiteCreateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    site = Site(tenant_id=tenant_id, name=payload.name, code=payload.code, location=payload.location)
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.get("/sites/{site_id}/areas", response_model=list[AreaResponse])
def list_areas(
    site_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    site = db.query(Site).filter(Site.id == site_id, Site.tenant_id == tenant_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return db.query(Area).filter(Area.site_id == site_id).all()


@router.post("/areas", response_model=AreaResponse, status_code=201)
def create_area(
    payload: AreaCreateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(get_current_user),
):
    site = db.query(Site).filter(Site.id == payload.site_id, Site.tenant_id == tenant_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    area = Area(site_id=payload.site_id, name=payload.name, code=payload.code)
    db.add(area)
    db.commit()
    db.refresh(area)
    return area
