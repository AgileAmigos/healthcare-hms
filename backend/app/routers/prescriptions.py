from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_doctor, get_current_active_staff

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)

@router.post("/", response_model=schemas.Prescription, status_code=status.HTTP_201_CREATED)
def create_prescription(
    prescription: schemas.PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_doctor) # Only doctors can create
):
    """
    Creates a new prescription for a patient.

    This endpoint is restricted to users with the 'doctor' role.
    """
    # Verify patient exists before creating a prescription
    db_patient = crud.get_patient(db, patient_id=prescription.patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    return crud.create_prescription(db=db, prescription=prescription, doctor_id=current_user.user_id)


@router.get("/patient/{patient_id}", response_model=List[schemas.Prescription])
def read_prescriptions_for_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_staff) # Staff can view
):
    """
    Retrieves all prescriptions for a specific patient.

    This endpoint is accessible by all authenticated staff (doctors and nurses).
    """
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return crud.get_prescriptions_for_patient(db=db, patient_id=patient_id)

