from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_staff

router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"]
)

@router.post("/", response_model=schemas.Appointment, status_code=status.HTTP_201_CREATED)
def create_appointment_request(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db)
):
    """
    Creates a new appointment request.

    This is a public endpoint that patients can use to request an appointment.
    The initial status will be 'pending'.
    """
    # In a real-world scenario, you'd want to verify the patient_id exists
    # but for this minimal setup, we'll proceed directly.
    return crud.create_appointment(db=db, appointment=appointment)


@router.get("/", response_model=List[schemas.Appointment])
def read_appointments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_staff) # Secure this endpoint
):
    """
    Retrieves a list of all appointments.

    This endpoint is accessible only by authenticated staff (doctors/nurses)
    and supports pagination.
    """
    appointments = crud.get_appointments(db, skip=skip, limit=limit)
    return appointments

@router.put("/{appointment_id}/status", response_model=schemas.Appointment)
def update_appointment_status(
    appointment_id: int,
    status_update: schemas.AppointmentUpdate, # You will need to create this schema
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_staff)
):
    """
    Update the status of an appointment (e.g., 'confirmed', 'cancelled').
    """
    updated_appointment = crud.update_appointment_status(
        db=db, appointment_id=appointment_id, status=status_update.status
    )
    if updated_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated_appointment