from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Date,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

   
    registered_patients = relationship("Patient", back_populates="registrar")
    uploaded_documents = relationship("Document", back_populates="uploader")
    prescribed = relationship("Prescription", back_populates="doctor")

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(50))
    contact_number = Column(String(20))
    address = Column(Text)
    registered_by = Column(Integer, ForeignKey("users.user_id"))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    
    registrar = relationship("User", back_populates="registered_patients")
    bed = relationship("Bed", back_populates="patient", uselist=False) # One-to-one
    documents = relationship("Document", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")


class Bed(Base):
    __tablename__ = "beds"

    bed_id = Column(Integer, primary_key=True, index=True)
    bed_number = Column(String(50), unique=True, nullable=False)
    is_occupied = Column(Boolean, default=False)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=True, unique=True)
    last_updated = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

   
    patient = relationship("Patient", back_populates="bed")

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    document_name = Column(String(255), nullable=False)
    document_type = Column(String(50))
    storage_path = Column(String(255), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"))
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    
    patient = relationship("Patient", back_populates="documents")
    uploader = relationship("User", back_populates="uploaded_documents")

class Prescription(Base):
    __tablename__ = "prescriptions"

    prescription_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    medication = Column(Text, nullable=False)
    dosage = Column(String(100))
    instructions = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("User", back_populates="prescribed")


class Appointment(Base):
    __tablename__ = "appointments"

    appointment_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    appointment_date = Column(TIMESTAMP(timezone=True), nullable=False)
    reason = Column(Text)
    status = Column(String(50), default='pending')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

   
    patient = relationship("Patient", back_populates="appointments")

