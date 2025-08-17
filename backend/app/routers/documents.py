import os
import shutil
from typing import List
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    UploadFile,
    HTTPException,
    status
)
from sqlalchemy.orm import Session

from .. import crud, schemas, models
from ..database import get_db
from ..dependencies import get_current_active_staff

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
    dependencies=[Depends(get_current_active_staff)] # Secure all routes
)

# Define a directory to store uploaded files
UPLOAD_DIRECTORY = "backend/uploads"
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

@router.post("/upload", response_model=schemas.Document, status_code=status.HTTP_201_CREATED)
def upload_document(
    patient_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_staff)
):
    """
    Handles the upload of a document for a specific patient.

    The file is saved to a local directory, and its metadata is stored
    in the database.
    """
    # Verify the patient exists
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Create a patient-specific directory if it doesn't exist
    patient_upload_dir = os.path.join(UPLOAD_DIRECTORY, str(patient_id))
    if not os.path.exists(patient_upload_dir):
        os.makedirs(patient_upload_dir)

    # Define the file path and save the file
    file_path = os.path.join(patient_upload_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    # Create the document record in the database
    return crud.create_document(
        db=db,
        patient_id=patient_id,
        file_name=file.filename,
        file_path=file_path,
        user_id=current_user.user_id,
        document_type=document_type
    )


@router.get("/patient/{patient_id}", response_model=List[schemas.Document])
def read_documents_for_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieves all document records for a specific patient.
    """
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return crud.get_documents_for_patient(db=db, patient_id=patient_id)

