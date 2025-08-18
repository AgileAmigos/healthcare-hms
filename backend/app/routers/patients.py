from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_staff

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
    dependencies=[Depends(get_current_active_staff)] # Secure all routes in this router
)

@router.post("/", response_model=schemas.Patient)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_staff)
):
    """
    Creates a new patient.

    This endpoint is accessible only by authenticated staff (doctors/nurses).
    The `registered_by` field is automatically set to the current user's ID.
    """
    return crud.create_patient(db=db, patient=patient, user_id=current_user.user_id)


@router.get("/", response_model=List[schemas.Patient])
def read_patients(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieves a list of all patients.

    This endpoint supports pagination using `skip` and `limit` query parameters.
    """
    patients = crud.get_patients(db, skip=skip, limit=limit)
    return patients


@router.get("/{patient_id}", response_model=schemas.Patient)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a single patient by their ID.
    """
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

@router.get("/alerts/high-priority", response_model=List[schemas.Patient])
def read_high_priority_alerts(db: Session = Depends(get_db)):
    """Retrieves patients with high-priority triage levels."""
    return crud.get_high_priority_patients(db)

@router.put("/{patient_id}/triage", response_model=schemas.Patient)
def update_triage(
    patient_id: int,
    triage_update: schemas.TriageUpdate,
    db: Session = Depends(get_db)
):
    """Updates a patient's triage level."""
    db_patient = crud.update_patient_triage_level(
        db=db, patient_id=patient_id, triage_level=triage_update.triage_level
    )
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient
