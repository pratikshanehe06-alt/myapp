import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.password_reset import ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import hash_password
from app.core.email import send_password_reset_email
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    generic_response = {"message": "If that email exists, a reset link has been sent."}

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return generic_response

    raw_token = secrets.token_urlsafe(32)
    token_record = PasswordResetToken(
        user_id=user.id,
        token_hash=_hash_token(raw_token),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
    )
    db.add(token_record)
    db.commit()

    reset_link = f"{settings.frontend_url}/reset-password?token={raw_token}"
    send_password_reset_email(user.email, reset_link)

    return generic_response


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    token_hash = _hash_token(payload.token)
    record = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token_hash == token_hash, PasswordResetToken.used == False)
        .first()
    )

    if not record or record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = db.query(User).filter(User.id == record.user_id).first()
    user.password_hash = hash_password(payload.new_password)
    record.used = True
    db.commit()

    return {"message": "Password has been reset successfully."}
