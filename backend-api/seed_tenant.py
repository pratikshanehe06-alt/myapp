from app.database import SessionLocal
from app.models.rbac import Role, Permission  # noqa: F401 — needed so SQLAlchemy resolves User.roles
from app.modules.tenants.models import Tenant
from app.models.user import User

db = SessionLocal()

tenant = db.query(Tenant).filter_by(slug="demo-manufacturing").first()
if not tenant:
    tenant = Tenant(name="Demo Manufacturing Co", slug="demo-manufacturing")
    db.add(tenant)
    db.commit()
    db.refresh(tenant)

users_without_tenant = db.query(User).filter(User.tenant_id.is_(None)).all()
for u in users_without_tenant:
    u.tenant_id = tenant.id

db.commit()
print(f"Tenant ready: {tenant.name} (id={tenant.id})")
print(f"Assigned {len(users_without_tenant)} existing user(s) to this tenant.")
