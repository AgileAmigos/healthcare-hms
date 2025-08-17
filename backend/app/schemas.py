from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True 



class PatientBase(BaseModel):
    full_name: str
    date_of_birth: date
    gender: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    patient_id: int
    registered_by: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BedBase(BaseModel):
    bed_number: str
    is_occupied: bool = False

class BedCreate(BedBase):
    pass

class BedUpdate(BaseModel):
    is_occupied: bool
    patient_id: Optional[int] = None

class Bed(BedBase):
    bed_id: int
    patient_id: Optional[int] = None
    last_updated: datetime
    patient: Optional[Patient] = None 

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    document_name: str
    document_type: Optional[str] = None

class DocumentCreate(DocumentBase):
    patient_id: int

class Document(DocumentBase):
    document_id: int
    patient_id: int
    storage_path: str
    uploaded_by: Optional[int] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


class PrescriptionBase(BaseModel):
    medication: str
    dosage: Optional[str] = None
    instructions: Optional[str] = None

class PrescriptionCreate(PrescriptionBase):
    patient_id: int

class Prescription(PrescriptionBase):
    prescription_id: int
    patient_id: int
    doctor_id: int
    created_at: datetime
    doctor: User 
    patient: Patient 

    class Config:
        from_attributes = True



class AppointmentBase(BaseModel):
    appointment_date: datetime
    reason: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    patient_id: int 

class AppointmentUpdate(BaseModel):
    doctor_id: Optional[int] = None
    status: Optional[str] = None

class Appointment(AppointmentBase):
    appointment_id: int
    patient_id: int
    doctor_id: Optional[int] = None
    status: str
    created_at: datetime
    patient: Patient 

    class Config:
        from_attributes = True

