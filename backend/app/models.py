import uuid
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .db import engine, SessionLocal
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(UUID, primary_key=True)
    digital_health_id = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)

class Staff(Base):
    __tablename__ = "staff"
    id = Column(UUID, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    specialization = Column(String)

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True)
    patient_id = Column(UUID, ForeignKey("patients.id"))
    doctor_id = Column(UUID, ForeignKey("staff.id"))
    appointment_time = Column(TIMESTAMP)
    reason = Column(Text)

class Admission(Base):
    __tablename__ = "admissions"
    id = Column(Integer, primary_key=True)
    patient_id = Column(UUID, ForeignKey("patients.id"))
    admitting_doctor_id = Column(UUID, ForeignKey("staff.id"))
    admission_date = Column(TIMESTAMP)
    room_number = Column(String)
    status = Column(String)

gender_type_enum = Enum('Male', 'Female', 'Other', 'Prefer not to say', name='gender_type')

class Patient(Base):
    __tablename__ = "patients"
    
    __table_args__ = {"schema": "public"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=True)
    
    # NOTE: Your SQL has a 'digital_health_id'. You may want to add it here.
    # digital_health_id = Column(String(50), unique=True, nullable=False)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(gender_type_enum)
    phone_number = Column(String(20))
    address = Column(String) 
    
    presenting_complaint = Column(String)
    triage_level = Column(String, nullable=True)
