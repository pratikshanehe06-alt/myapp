from pydantic import BaseModel


class SiteCreateRequest(BaseModel):
    name: str
    code: str | None = None
    location: str | None = None


class SiteResponse(BaseModel):
    id: int
    name: str
    code: str | None
    location: str | None
    class Config:
        from_attributes = True


class AreaCreateRequest(BaseModel):
    site_id: int
    name: str
    code: str | None = None


class AreaResponse(BaseModel):
    id: int
    site_id: int
    name: str
    code: str | None
    class Config:
        from_attributes = True
