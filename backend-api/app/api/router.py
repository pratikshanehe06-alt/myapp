from fastapi import APIRouter

# Existing, already-working routers — imported from their current location,
# NOT moved, so nothing that already works gets disturbed.
from app.api import auth as auth_module
from app.api import password_reset as password_reset_module
from app.api import rbac as rbac_module

# New modules, built in the modules/ structure
from app.modules.tenants.router import router as tenants_router
from app.modules.organization.router import router as organization_router
from app.modules.assets.router import router as assets_router
from app.modules.tags.router import router as tags_router
from app.modules.telemetry.router import router as telemetry_router
from app.modules.apm.router import router as apm_router
from app.modules.employees.router import router as employees_router

api_router = APIRouter()

# Existing
api_router.include_router(auth_module.router)
api_router.include_router(password_reset_module.router)
api_router.include_router(rbac_module.router)

# New
api_router.include_router(tenants_router)
api_router.include_router(organization_router)
api_router.include_router(assets_router)
api_router.include_router(tags_router)
api_router.include_router(telemetry_router)
api_router.include_router(apm_router)
api_router.include_router(employees_router)
