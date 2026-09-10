from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_tenant, require_permission
from app.models.user import User
from app.models.rbac import Role
from app.core.security import hash_password
from app.modules.tenants.models import Tenant
from app.modules.tenants.schemas import TenantResponse, TenantCreateRequest, TenantUpdateRequest

router = APIRouter(prefix="/tenants", tags=["tenants"])

PLATFORM_ADMIN = "platform.user.admin"


def _to_response(tenant: Tenant) -> TenantResponse:
    modules = [m.strip() for m in (tenant.enabled_modules or "").split(",") if m.strip()]
    return TenantResponse(
        id=tenant.id,
        name=tenant.name,
        slug=tenant.slug,
        is_active=tenant.is_active,
        enabled_modules=modules,
    )


@router.get("/current", response_model=TenantResponse)
def get_current_tenant_details(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return _to_response(tenant)


@router.get("", response_model=list[TenantResponse])
def list_tenants(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    return [_to_response(t) for t in db.query(Tenant).all()]


@router.post("", response_model=TenantResponse, status_code=201)
def create_tenant(
    payload: TenantCreateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    if db.query(Tenant).filter(Tenant.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="A tenant with this slug already exists")
    if db.query(User).filter(User.email == payload.admin_email).first():
        raise HTTPException(status_code=400, detail="A user with this admin email already exists")

    tenant = Tenant(
        name=payload.name,
        slug=payload.slug,
        enabled_modules=",".join(payload.enabled_modules),
    )
    db.add(tenant)
    db.flush()

    admin_user = User(
        email=payload.admin_email,
        password_hash=hash_password(payload.admin_password),
        full_name=payload.admin_full_name,
        tenant_id=tenant.id,
    )
    db.add(admin_user)
    db.flush()

    for role_name in ("Tenant Super Admin", "Tenant Admin"):
        role = db.query(Role).filter(Role.name == role_name).first()
        if role and role not in admin_user.roles:
            admin_user.roles.append(role)

    db.commit()
    db.refresh(tenant)
    return _to_response(tenant)


@router.put("/{tenant_id}", response_model=TenantResponse)
def update_tenant(
    tenant_id: int,
    payload: TenantUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    if payload.name is not None:
        tenant.name = payload.name
    if payload.is_active is not None:
        tenant.is_active = payload.is_active
    if payload.enabled_modules is not None:
        tenant.enabled_modules = ",".join(payload.enabled_modules)

    db.commit()
    db.refresh(tenant)
    return _to_response(tenant)


@router.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    db.delete(tenant)
    db.commit()
    return {"message": "Tenant deleted"}
