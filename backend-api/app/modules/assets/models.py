from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=False)
    asset_code = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(100), nullable=False)
    manufacturer = Column(String(255))
    model = Column(String(255))
    serial_number = Column(String(255))
    criticality = Column(String(20), default="medium")
    status = Column(String(20), default="offline")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
