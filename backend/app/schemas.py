# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    full_name: str
    age: int
    gender: str
    presenting_complaint: str

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    triage_level: Optional[str] = None

    class Config:
        orm_mode = True