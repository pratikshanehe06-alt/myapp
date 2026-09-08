from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    tag_name = Column(String(255), nullable=False)
    parameter = Column(String(100))
    data_type = Column(String(20), default="float")
    unit = Column(String(20))
    min_value = Column(Float, nullable=True)
    max_value = Column(Float, nullable=True)
    warning_threshold = Column(Float, nullable=True)
    critical_threshold = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
