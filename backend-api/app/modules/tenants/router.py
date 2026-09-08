from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_tenant
from app.modules.tenants.models import Tenant
from app.modules.tenants.schemas import TenantResponse

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/current", response_model=TenantResponse)
def get_current_tenant_details(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
):
    return db.query(Tenant).filter(Tenant.id == tenant_id).first()
