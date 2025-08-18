from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from ..db import get_db
from .. import models, schemas
from uuid import uuid4

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# ---------------- Schedule Appointment ----------------
@router.post("/schedule", response_model=schemas.Appointment)
def schedule_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    # Check if patient exists
    patient = db.query(models.Patient).filter(models.Patient.id == appointment.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Check if doctor exists
    doctor = db.query(models.Staff).filter(models.Staff.id == appointment.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Create appointment
    db_appointment = models.Appointment(
        id=str(uuid4()),
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

# ---------------- List Doctors ----------------
@router.get("/doctors", response_model=List[schemas.Staff])
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(models.Staff).filter(models.Staff.role == "Doctor").all()
    return doctors
