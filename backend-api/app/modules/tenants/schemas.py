from pydantic import BaseModel


class TenantResponse(BaseModel):
    id: int
    name: str
    slug: str
    is_active: bool
    enabled_modules: list[str]
    class Config:
        from_attributes = True


class TenantCreateRequest(BaseModel):
    name: str
    slug: str
    enabled_modules: list[str] = ["apm"]
    admin_email: str
    admin_password: str
    admin_full_name: str | None = None


class TenantUpdateRequest(BaseModel):
    name: str | None = None
    is_active: bool | None = None
    enabled_modules: list[str] | None = None
