from app.database import SessionLocal
from app.models.rbac import Role, Permission

db = SessionLocal()

perm = db.query(Permission).filter_by(code="tenant.plant.manage").first()
if not perm:
    perm = Permission(code="tenant.plant.manage", description="Manage sites and areas within own tenant")
    db.add(perm)
    db.flush()

role = db.query(Role).filter_by(name="Tenant Admin").first()
if role and perm not in role.permissions:
    role.permissions.append(perm)

super_role = db.query(Role).filter_by(name="Tenant Super Admin").first()
if super_role and perm not in super_role.permissions:
    super_role.permissions.append(perm)

db.commit()
print("Added permission 'tenant.plant.manage' to Tenant Admin and Tenant Super Admin roles.")
