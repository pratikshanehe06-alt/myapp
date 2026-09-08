from app.database import SessionLocal
from app.models.rbac import Role, Permission

db = SessionLocal()

perm = db.query(Permission).filter_by(code="tenant.employee.manage").first()
if not perm:
    perm = Permission(code="tenant.employee.manage", description="Manage employees within own tenant")
    db.add(perm)
    db.flush()

role = db.query(Role).filter_by(name="Tenant Admin").first()
if not role:
    role = Role(name="Tenant Admin", is_system_role="true", description="Company-side admin who manages their own employees")
    db.add(role)
    db.flush()

if perm not in role.permissions:
    role.permissions.append(perm)

db.commit()
print("Added permission 'tenant.employee.manage' and role 'Tenant Admin'.")
