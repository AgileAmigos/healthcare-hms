from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from ..db import get_db
from .. import models, schemas
from typing import List
from uuid import uuid4

router = APIRouter(prefix="/patients", tags=["Patients"])

# ---------------- Registration ----------------


@router.post("/register", response_model=schemas.Patient)
def register_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    # Check if user_id already exists
    if patient.user_id:
        existing_patient = db.query(models.Patient).filter(models.Patient.user_id == patient.user_id).first()
        if existing_patient:
            raise HTTPException(status_code=400, detail="User already registered")

    # Create new patient entry
    db_patient = models.Patient(
        id=str(uuid4()),  # auto-generate unique UUID
        user_id=patient.user_id,
        first_name=patient.first_name,
        last_name=patient.last_name,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        phone_number=patient.phone_number,
        address=patient.address,
        presenting_complaint=patient.presenting_complaint,
        triage_level=patient.triage_level
    )

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


# ---------------- Get All Patients ----------------
@router.get("/", response_model=List[schemas.Patient])
def get_all_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(models.Patient).offset(skip).limit(limit).all()
    return patients

# ---------------- Update Triage ----------------
@router.put("/{patient_id}/triage", response_model=schemas.Patient)
def update_patient_triage(patient_id: str, triage_update: schemas.TriageUpdate, db: Session = Depends(get_db)):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db_patient.triage_level = triage_update.triage_level
    db.commit()
    db.refresh(db_patient)
    return db_patient

# ---------------- High Priority Alerts ----------------
@router.get("/alerts/high-priority", response_model=List[schemas.Patient])
def get_high_priority_patients(db: Session = Depends(get_db)):
    high_priority_levels = ["Resuscitation", "Emergency"]
    alerts = db.query(models.Patient).filter(models.Patient.triage_level.in_(high_priority_levels)).all()
    return alerts
