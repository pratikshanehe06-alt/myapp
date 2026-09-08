from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from app.database import get_db
from app.models.user import User
from app.core.security import decode_token
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = decode_token(token, settings.jwt_secret)
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user


def get_current_tenant(current_user: User = Depends(get_current_user)) -> int:
    if current_user.tenant_id is None:
        raise HTTPException(status_code=400, detail="User is not assigned to a tenant")
    return current_user.tenant_id


def require_permission(permission_code: str):
    def checker(current_user: User = Depends(get_current_user)) -> User:
        user_permission_codes = {
            perm.code
            for role in current_user.roles
            for perm in role.permissions
        }
        if permission_code not in user_permission_codes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {permission_code}",
            )
        return current_user
    return checker
