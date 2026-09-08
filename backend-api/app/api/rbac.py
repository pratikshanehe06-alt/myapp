from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.rbac import Role, Permission
from app.dependencies import get_current_user, require_permission

router = APIRouter(prefix="/rbac", tags=["rbac"])

ADMIN_PERMISSION = "platform.user.admin"


@router.get("/roles")
def list_roles(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(ADMIN_PERMISSION)),
):
    roles = db.query(Role).all()
    return [{"id": r.id, "name": r.name, "permissions": [p.code for p in r.permissions]} for r in roles]


@router.get("/permissions")
def list_permissions(
    db: Session = Depends(get_db),
    user: User = Depends(require_permission(ADMIN_PERMISSION)),
):
    perms = db.query(Permission).all()
    return [{"id": p.id, "code": p.code, "description": p.description} for p in perms]


@router.post("/users/{user_id}/roles/{role_id}")
def assign_role_to_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_permission(ADMIN_PERMISSION)),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == role_id).first()
    if not target_user or not role:
        raise HTTPException(status_code=404, detail="User or role not found")
    if role not in target_user.roles:
        target_user.roles.append(role)
        db.commit()
    return {"message": "Role assigned"}


@router.get("/my-permissions")
def my_permissions(user: User = Depends(get_current_user)):
    codes = sorted({perm.code for role in user.roles for perm in role.permissions})
    return {"permissions": codes}
