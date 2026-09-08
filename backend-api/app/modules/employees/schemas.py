from pydantic import BaseModel


class EmployeeCreateRequest(BaseModel):
    employee_code: str | None = None
    full_name: str
    designation: str | None = None
    department: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None


class EmployeeUpdateRequest(BaseModel):
    employee_code: str | None = None
    full_name: str | None = None
    designation: str | None = None
    department: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None


class EmployeeResponse(BaseModel):
    id: int
    employee_code: str | None
    full_name: str
    designation: str | None
    department: str | None
    contact_email: str | None
    contact_phone: str | None
    class Config:
        from_attributes = True
