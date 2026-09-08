from pydantic import BaseModel


class PlantSummaryResponse(BaseModel):
    total_assets: int
    running: int
    idle: int
    fault: int
    stopped: int
    maintenance: int
    offline: int
    average_health: int
    critical_assets: int


class AssetHealthResponse(BaseModel):
    asset_id: int
    asset_name: str
    status: str
    health_score: int
    criticality: str
