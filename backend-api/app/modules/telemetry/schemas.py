from pydantic import BaseModel
from datetime import datetime


class TelemetryReadingResponse(BaseModel):
    tag_id: int
    value: float
    quality: str
    timestamp: datetime
    class Config:
        from_attributes = True


class LatestReadingResponse(BaseModel):
    tag_id: int
    tag_name: str
    unit: str | None
    value: float
    quality: str
