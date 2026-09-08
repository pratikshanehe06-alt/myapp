from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50))
    location = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True)
    site_id = Column(Integer, ForeignKey("sites.id"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
