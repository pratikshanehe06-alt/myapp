from app.database import SessionLocal
from app.models.rbac import Role, Permission

db = SessionLocal()

perm_codes = [
    ("apm.asset.view", "View assets"),
    ("apm.asset.create", "Create assets"),
    ("apm.asset.edit", "Edit assets"),
    ("apm.asset.delete", "Delete assets"),
    ("apm.alarm.acknowledge", "Acknowledge alarms"),
    ("platform.user.admin", "Manage users and roles"),
]

perms = {}
for code, desc in perm_codes:
    p = db.query(Permission).filter_by(code=code).first()
    if not p:
        p = Permission(code=code, description=desc)
        db.add(p)
        db.flush()
    perms[code] = p

roles_config = {
    "Tenant Super Admin": list(perms.values()),
    "Reliability Engineer": [perms["apm.asset.view"], perms["apm.alarm.acknowledge"]],
    "Viewer": [perms["apm.asset.view"]],
}

for role_name, role_perms in roles_config.items():
    r = db.query(Role).filter_by(name=role_name).first()
    if not r:
        r = Role(name=role_name, is_system_role="true")
        db.add(r)
        db.flush()
    r.permissions = role_perms

db.commit()
print("RBAC seed complete.")
