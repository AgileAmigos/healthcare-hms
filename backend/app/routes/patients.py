# backend/app/routes/patients.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.db import get_db

router = APIRouter(prefix="/api", tags=["Patients"])

# HMS-23: Register a new patient
@router.post("/patients/register", response_model=schemas.Patient)
def register_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    # Convert Pydantic model to SQLAlchemy model
    db_patient = models.Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

# Endpoint for the Triage Dashboard to get all patients
@router.get("/patients", response_model=List[schemas.Patient])
def get_all_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(models.Patient).offset(skip).limit(limit).all()
    return patients

# HMS-24: Update a patient's triage level
@router.put("/patients/{patient_id}/triage", response_model=schemas.Patient)
def update_patient_triage(patient_id: str, triage_update: schemas.TriageUpdate, db: Session = Depends(get_db)):
    # Note: patient_id is now a string because UUIDs are sent as strings
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db_patient.triage_level = triage_update.triage_level
    db.commit()
    db.refresh(db_patient)
    return db_patient

# HMS-25: Get high-priority alerts
@router.get("/alerts/high-priority", response_model=List[schemas.Patient])
def get_high_priority_patients(db: Session = Depends(get_db)):
    high_priority_levels = ["Resuscitation", "Emergency"]
    alerts = db.query(models.Patient).filter(models.Patient.triage_level.in_(high_priority_levels)).all()
    return alerts