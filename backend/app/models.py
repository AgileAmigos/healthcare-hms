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
