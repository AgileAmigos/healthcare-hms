# backend/app/schemas.py
import uuid
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date

# Base schema for patient data, used for creation
class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str # This will be validated against the ENUM values
    presenting_complaint: Optional[str] = None
    # Add other fields from your model that are required on creation
    
class PatientCreate(PatientBase):
    pass

# Schema for updating triage level
class TriageUpdate(BaseModel):
    triage_level: str

# Schema for reading patient data (will be returned from the API)
class Patient(PatientBase):
    id: uuid.UUID
    triage_level: Optional[str] = None
    
    # This replaces orm_mode = True in Pydantic V2
    model_config = ConfigDict(from_attributes=True)