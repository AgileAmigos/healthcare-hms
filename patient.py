from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func 
from datetime import date
from ..db import get_db
from .. import models, schemas
from typing import List
from uuid import uuid4

router = APIRouter(prefix="/patients", tags=["Patients"])

# ---------------- OPD Patients ----------------
@router.get("/opd")
def get_opd_patients(date_filter: date = Query(...), db: Session = Depends(get_db)):
    records = (
        db.query(models.Appointment, models.Patient, models.Staff)
        .join(models.Patient, models.Appointment.patient_id == models.Patient.id)
        .join(models.Staff, models.Appointment.doctor_id == models.Staff.id)
        .filter(func.date(models.Appointment.appointment_time) == date_filter)
        .all()
    )

    return [
        {
            "appointment_id": appointment.id,
            "patient_id": patient.id,
            "patient_name": f'{patient.first_name} {patient.last_name}',  
            "doctor_id": staff.id,
            "doctor_name": f'{staff.first_name} {staff.last_name}',    
            "appointment_time": str(appointment.appointment_time),
        }
        for appointment, patient, staff in records
    ]

# ---------------- IPD Patients ----------------
@router.get("/ipd")
def get_ipd_patients(db: Session = Depends(get_db)):
    records = (
        db.query(models.Admission, models.Patient, models.Staff)
        .join(models.Patient, models.Admission.patient_id == models.Patient.id)
        .join(models.Staff, models.Admission.admitting_doctor_id == models.Staff.id)
        .filter(models.Admission.status == "Admitted")
        .all()
    )

    return [
        {
            "admission_id": admission.id,
            "patient_id": patient.id,
            "patient_name": f'{patient.first_name} {patient.last_name}',
            "admitting_doctor_id": staff.id,
            "admitting_doctor_name": f'{staff.first_name} {staff.last_name}',
            "room_number": admission.room_number,
            "status": admission.status,
            "admission_date": str(admission.admission_date),
        }
        for admission, patient, staff in records
    ]

# ---------------- Discharge Patient ----------------
@router.post("/ipd/{admission_id}/discharge")
def discharge_patient(admission_id: int, db: Session = Depends(get_db)):
    admission = db.query(models.Admission).get(admission_id)
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")

    admission.status = "Discharged"
    db.commit()
    return {"message": f"Patient {admission.patient_id} discharged successfully"}

# ---------------- Transfer Patient ----------------
@router.post("/ipd/{admission_id}/transfer")
def transfer_patient(admission_id: int, new_department_id: int, db: Session = Depends(get_db)):
    admission = db.query(models.Admission).get(admission_id)
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")

    admission.status = "Transferred"
    admission.room_number = f"Dept-{new_department_id}"
    db.commit()
    return {"message": f"Patient {admission.patient_id} transferred successfully"}

# ---------------- Registration ----------------
@router.post("/register", response_model=schemas.Patient)
def register_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    # Optional: check if user_id exists to avoid duplicates
    if hasattr(patient, "user_id") and patient.user_id:
        existing = db.query(models.Patient).filter(models.Patient.user_id == patient.user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="User already registered")

    db_patient = models.Patient(
        id=str(uuid4()),
        user_id=getattr(patient, "user_id", None),
        first_name=patient.first_name,
        last_name=patient.last_name,
        date_of_birth=patient.date_of_birth,
        gender=patient.gender,
        phone_number=getattr(patient, "phone_number", None),
        address=getattr(patient, "address", None),
        presenting_complaint=getattr(patient, "presenting_complaint", None),
        # triage_level is optional and not included in registration
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
