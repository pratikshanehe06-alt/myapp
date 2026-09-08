from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_permission, get_current_tenant
from app.modules.employees.models import Employee
from app.modules.employees.schemas import EmployeeCreateRequest, EmployeeUpdateRequest, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["employees"])

EMPLOYEE_PERMISSION = "tenant.employee.manage"


@router.get("", response_model=list[EmployeeResponse])
def list_employees(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(EMPLOYEE_PERMISSION)),
):
    return db.query(Employee).filter(Employee.tenant_id == tenant_id).all()


@router.post("", response_model=EmployeeResponse, status_code=201)
def create_employee(
    payload: EmployeeCreateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(EMPLOYEE_PERMISSION)),
):
    employee = Employee(tenant_id=tenant_id, **payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    payload: EmployeeUpdateRequest,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(EMPLOYEE_PERMISSION)),
):
    employee = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(get_current_tenant),
    user=Depends(require_permission(EMPLOYEE_PERMISSION)),
):
    employee = db.query(Employee).filter(Employee.id == employee_id, Employee.tenant_id == tenant_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted"}
