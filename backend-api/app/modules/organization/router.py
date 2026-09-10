from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_current_tenant, require_permission
from app.modules.organization.models import Site, Area
from app.modules.organization.schemas import (
    SiteCreateRequest,
    SiteUpdateRequest,
    SiteResponse,
    AreaCreateRequest,
    AreaUpdateRequest,
    AreaResponse,
)

router = APIRouter(prefix="/org", tags=["organization"])

PLANT_PERMISSION = "tenant.plant.manage"


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
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    site = Site(tenant_id=tenant_id, name=payload.name, code=payload.code, location=payload.location)
    db.add(site)
    db.commit()
    db.refresh(site)
    return site


@router.put("/sites/{site_id}", response_model=SiteResponse)
def update_site(
    site_id: int,
    payload: SiteUpdateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    site = db.query(Site).filter(Site.id == site_id, Site.tenant_id == tenant_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(site, field, value)
    db.commit()
    db.refresh(site)
    return site


@router.delete("/sites/{site_id}")
def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    site = db.query(Site).filter(Site.id == site_id, Site.tenant_id == tenant_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    db.delete(site)
    db.commit()
    return {"message": "Site deleted"}


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
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    site = db.query(Site).filter(Site.id == payload.site_id, Site.tenant_id == tenant_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    area = Area(site_id=payload.site_id, name=payload.name, code=payload.code)
    db.add(area)
    db.commit()
    db.refresh(area)
    return area


@router.put("/areas/{area_id}", response_model=AreaResponse)
def update_area(
    area_id: int,
    payload: AreaUpdateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    area = (
        db.query(Area)
        .join(Site, Area.site_id == Site.id)
        .filter(Area.id == area_id, Site.tenant_id == tenant_id)
        .first()
    )
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(area, field, value)
    db.commit()
    db.refresh(area)
    return area


@router.delete("/areas/{area_id}")
def delete_area(
    area_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(PLANT_PERMISSION)),
):
    area = (
        db.query(Area)
        .join(Site, Area.site_id == Site.id)
        .filter(Area.id == area_id, Site.tenant_id == tenant_id)
        .first()
    )
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    db.delete(area)
    db.commit()
    return {"message": "Area deleted"}
