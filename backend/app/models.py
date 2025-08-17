# backend/app/models.py
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

Base = declarative_base()

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, nullable=False) # Assuming this links to medical_records
    doctor_id = Column(UUID(as_uuid=True), nullable=False)
    notes = Column(Text)
    prescription_date = Column(DateTime, default=datetime.utcnow)

    medications = relationship("PrescriptionMedication", back_populates="prescription")

class PrescriptionMedication(Base):
    __tablename__ = "prescription_medications"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(Integer, ForeignKey("prescriptions.id"))
    medication_id = Column(Integer, nullable=False) # Assuming this links to medications table
    dosage = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    duration = Column(String, nullable=False)

    prescription = relationship("Prescription", back_populates="medications")