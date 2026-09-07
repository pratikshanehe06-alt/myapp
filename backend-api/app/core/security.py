from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({**data, "exp": expire, "type": "access"}, settings.jwt_secret, algorithm=settings.jwt_algorithm)

def create_refresh_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    return jwt.encode({**data, "exp": expire, "type": "refresh"}, settings.jwt_refresh_secret, algorithm=settings.jwt_algorithm)

def decode_token(token: str, secret: str) -> dict:
    return jwt.decode(token, secret, algorithms=[settings.jwt_algorithm])
