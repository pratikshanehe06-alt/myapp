from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    # Comma-separated module keys enabled for this tenant, e.g. "apm,ems"
    # Simple stand-in for the full Configuration Engine (Phase 7, deferred).
    enabled_modules = Column(String(500), default="apm")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
