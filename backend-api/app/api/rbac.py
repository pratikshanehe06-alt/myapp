from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.rbac import Role, Permission
from app.dependencies import get_current_user, require_permission

router = APIRouter(prefix="/rbac", tags=["rbac"])

PLATFORM_ADMIN = "platform.user.admin"


def _role_to_dict(role: Role) -> dict:
    return {
        "id": role.id,
        "name": role.name,
        "description": role.description,
        "is_system_role": role.is_system_role,
        "permissions": [{"id": p.id, "code": p.code, "description": p.description} for p in role.permissions],
    }


@router.get("/permissions")
def list_permissions(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    perms = db.query(Permission).order_by(Permission.code).all()
    return [{"id": p.id, "code": p.code, "description": p.description} for p in perms]


@router.post("/permissions", status_code=201)
def create_permission(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    code = payload.get("code")
    description = payload.get("description")
    if not code:
        raise HTTPException(status_code=400, detail="code is required")
    if db.query(Permission).filter(Permission.code == code).first():
        raise HTTPException(status_code=400, detail="Permission code already exists")
    perm = Permission(code=code, description=description)
    db.add(perm)
    db.commit()
    db.refresh(perm)
    return {"id": perm.id, "code": perm.code, "description": perm.description}


@router.get("/roles")
def list_roles(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    return [_role_to_dict(r) for r in db.query(Role).all()]


@router.post("/roles", status_code=201)
def create_role(
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    name = payload.get("name")
    description = payload.get("description")
    permission_ids = payload.get("permission_ids", [])
    if not name:
        raise HTTPException(status_code=400, detail="name is required")
    if db.query(Role).filter(Role.name == name).first():
        raise HTTPException(status_code=400, detail="A role with this name already exists")

    role = Role(name=name, description=description, is_system_role="false")
    if permission_ids:
        role.permissions = db.query(Permission).filter(Permission.id.in_(permission_ids)).all()
    db.add(role)
    db.commit()
    db.refresh(role)
    return _role_to_dict(role)


@router.put("/roles/{role_id}")
def update_role(
    role_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if "name" in payload and payload["name"] is not None:
        role.name = payload["name"]
    if "description" in payload and payload["description"] is not None:
        role.description = payload["description"]
    if "permission_ids" in payload and payload["permission_ids"] is not None:
        role.permissions = db.query(Permission).filter(Permission.id.in_(payload["permission_ids"])).all()

    db.commit()
    db.refresh(role)
    return _role_to_dict(role)


@router.delete("/roles/{role_id}")
def delete_role(
    role_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    if role.is_system_role == "true":
        raise HTTPException(status_code=400, detail="System roles cannot be deleted")
    db.delete(role)
    db.commit()
    return {"message": "Role deleted"}


@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "tenant_id": u.tenant_id,
            "is_active": u.is_active,
            "roles": [{"id": r.id, "name": r.name} for r in u.roles],
        }
        for u in users
    ]


@router.post("/users/{user_id}/roles/{role_id}")
def assign_role_to_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == role_id).first()
    if not target_user or not role:
        raise HTTPException(status_code=404, detail="User or role not found")
    if role not in target_user.roles:
        target_user.roles.append(role)
        db.commit()
    return {"message": "Role assigned"}


@router.delete("/users/{user_id}/roles/{role_id}")
def remove_role_from_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_permission(PLATFORM_ADMIN)),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == role_id).first()
    if not target_user or not role:
        raise HTTPException(status_code=404, detail="User or role not found")
    if role in target_user.roles:
        target_user.roles.remove(role)
        db.commit()
    return {"message": "Role removed"}


@router.get("/my-permissions")
def my_permissions(user: User = Depends(get_current_user)):
    codes = sorted({perm.code for role in user.roles for perm in role.permissions})
    return {"permissions": codes}
