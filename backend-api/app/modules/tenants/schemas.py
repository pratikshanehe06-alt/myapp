from pydantic import BaseModel


class TenantResponse(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool
    class Config:
        from_attributes = True
