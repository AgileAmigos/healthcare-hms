from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_staff

router = APIRouter(
    prefix="/beds",
    tags=["Beds"],
    dependencies=[Depends(get_current_active_staff)] # Secure all routes
)

@router.get("/", response_model=List[schemas.Bed])
def read_beds(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieves a list of all beds and their occupancy status.
    
    Supports pagination.
    """
    beds = crud.get_beds(db, skip=skip, limit=limit)
    return beds

@router.put("/{bed_id}", response_model=schemas.Bed)
def update_bed_allocation(
    bed_id: int,
    bed_update: schemas.BedUpdate,
    db: Session = Depends(get_db)
):
    """
    Updates a bed's status (e.g., assign or unassign a patient).

    This allows staff to manage bed allocations.
    """
    db_bed = crud.get_bed(db, bed_id=bed_id)
    if db_bed is None:
        raise HTTPException(status_code=404, detail="Bed not found")
    
    # Ensure patient exists if a patient_id is provided
    if bed_update.patient_id:
        db_patient = crud.get_patient(db, patient_id=bed_update.patient_id)
        if db_patient is None:
            raise HTTPException(status_code=404, detail="Patient to be assigned not found")

    return crud.update_bed(db=db, bed_id=bed_id, bed_update=bed_update)

