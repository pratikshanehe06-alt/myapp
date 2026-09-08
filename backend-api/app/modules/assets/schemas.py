from pydantic import BaseModel


class AssetCreateRequest(BaseModel):
    area_id: int
    asset_code: str
    name: str
    asset_type: str
    manufacturer: str | None = None
    model: str | None = None
    serial_number: str | None = None
    criticality: str = "medium"


class AssetResponse(BaseModel):
    id: int
    area_id: int
    asset_code: str
    name: str
    asset_type: str
    manufacturer: str | None
    model: str | None
    criticality: str
    status: str
    class Config:
        from_attributes = True
