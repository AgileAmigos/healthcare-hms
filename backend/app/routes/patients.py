from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func # <-- IMPORT THIS
from datetime import date
from ..db import get_db
from .. import models

router = APIRouter(prefix="/patients", tags=["Patients"])

# -----------------------------
# OPD Patients by date
# -----------------------------
@router.get("/opd")
def get_opd_patients(date_filter: date = Query(...), db: Session = Depends(get_db)):
    records = (
        db.query(models.Appointment, models.Patient, models.Staff)
        .join(models.Patient, models.Appointment.patient_id == models.Patient.id)
        .join(models.Staff, models.Appointment.doctor_id == models.Staff.id)
        # ADD THE FILTER LOGIC ON THE LINE BELOW
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


# -----------------------------
# IPD (Admitted Patients)
# -----------------------------
@router.get("/ipd")
def get_ipd_patients(db: Session = Depends(get_db)):
    # The query now fetches Admission, Patient, and Staff objects
    records = (
        db.query(models.Admission, models.Patient, models.Staff) # <-- MODIFIED THIS LINE
        .join(models.Patient, models.Admission.patient_id == models.Patient.id)
        .join(models.Staff, models.Admission.admitting_doctor_id == models.Staff.id)
        .filter(models.Admission.status == "Admitted")
        .all()
    )

    # The code now unpacks the tuple (admission, patient, staff) for each record
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
        for admission, patient, staff in records # <-- MODIFIED THIS LINE
    ]


# -----------------------------
# Discharge patient
# -----------------------------
@router.post("/ipd/{admission_id}/discharge")
def discharge_patient(admission_id: int, db: Session = Depends(get_db)):
    admission = db.query(models.Admission).get(admission_id)
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")

    admission.status = "Discharged"
    db.commit()
    return {"message": f"Patient {admission.patient_id} discharged successfully"}


# -----------------------------
# Transfer patient
# -----------------------------
@router.post("/ipd/{admission_id}/transfer")
def transfer_patient(admission_id: int, new_department_id: int, db: Session = Depends(get_db)):
    admission = db.query(models.Admission).get(admission_id)
    if not admission:
        raise HTTPException(status_code=404, detail="Admission not found")

    admission.status = "Transferred"
    admission.room_number = f"Dept-{new_department_id}"  # Simplified example
    db.commit()
    return {"message": f"Patient {admission.patient_id} transferred successfully"}
