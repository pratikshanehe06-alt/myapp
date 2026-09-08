from pydantic import BaseModel


class TagCreateRequest(BaseModel):
    tag_name: str
    parameter: str | None = None
    unit: str | None = None
    min_value: float | None = None
    max_value: float | None = None
    warning_threshold: float | None = None
    critical_threshold: float | None = None


class TagResponse(BaseModel):
    id: int
    asset_id: int
    tag_name: str
    parameter: str | None
    unit: str | None
    min_value: float | None
    max_value: float | None
    warning_threshold: float | None
    critical_threshold: float | None
    class Config:
        from_attributes = True
