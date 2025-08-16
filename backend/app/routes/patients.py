from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
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
        db.query(models.Appointment)
        .join(models.Patient, models.Appointment.patient_id == models.Patient.id)
        .join(models.Staff, models.Appointment.doctor_id == models.Staff.id)
        .filter(models.Appointment.appointment_time.cast(date) == date_filter)
        .all()
    )

    # Serialize records into JSON-friendly dicts
    return [
        {
            "appointment_id": r.id,
            "patient_id": r.patient.id,
            "patient_name": r.patient.name,
            "doctor_id": r.doctor.id,
            "doctor_name": r.doctor.name,
            "appointment_time": str(r.appointment_time),
        }
        for r in records
    ]


# -----------------------------
# IPD (Admitted Patients)
# -----------------------------
@router.get("/ipd")
def get_ipd_patients(db: Session = Depends(get_db)):
    admissions = (
        db.query(models.Admission)
        .join(models.Patient, models.Admission.patient_id == models.Patient.id)
        .join(models.Staff, models.Admission.admitting_doctor_id == models.Staff.id)
        .filter(models.Admission.status == "Admitted")
        .all()
    )

    return [
        {
            "admission_id": a.id,
            "patient_id": a.patient.id,
            "patient_name": a.patient.name,
            "admitting_doctor_id": a.doctor.id,
            "admitting_doctor_name": a.doctor.name,
            "room_number": a.room_number,
            "status": a.status,
            "admission_date": str(a.admission_date),
        }
        for a in admissions
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
