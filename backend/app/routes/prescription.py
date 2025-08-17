# backend/app/routes/prescriptions.py

# --- REMOVED ---
# import psycopg2 (We are now using SQLAlchemy)

# --- ADDED ---
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from .. import models  # Import the new models
from ..db import get_db # Import the official DB dependency
from typing import List
from pydantic import BaseModel

# --- Pydantic Models for Data Validation (No changes here) ---
class Medication(BaseModel):
    medication_name: str
    dosage: str
    frequency: str
    duration: str

class PatientInfo(BaseModel):
    name: str
    age: str
    gender: str

class PrescriptionPayload(BaseModel):
    record_id: int
    doctor_id: str
    notes: str
    medications: List[Medication]
    patient_info: PatientInfo

# --- Use APIRouter ---
router = APIRouter()


# --- API Endpoint to Create a Prescription (REFACTORED) ---
@router.post("/create_prescription", status_code=status.HTTP_201_CREATED)
def create_prescription(payload: PrescriptionPayload, db: Session = Depends(get_db)):
    """
    Receives prescription data and saves it using the SQLAlchemy session.
    """
    try:
        # Step 1: Create a new Prescription object
        new_prescription = models.Prescription(
            record_id=payload.record_id,
            doctor_id=payload.doctor_id,
            notes=payload.notes
        )
        db.add(new_prescription)
        db.commit()
        db.refresh(new_prescription) # Get the new ID from the database

        # Step 2: Loop through medications and create objects
        for med in payload.medications:
            # Note: This still assumes medication_id=1.
            # A real app would look up the ID from the 'medications' table first.
            medication_id = 1

            new_med_entry = models.PrescriptionMedication(
                prescription_id=new_prescription.id,
                medication_id=medication_id,
                dosage=med.dosage,
                frequency=med.frequency,
                duration=med.duration
            )
            db.add(new_med_entry)
        
        db.commit()

    except Exception as e:
        db.rollback() # Roll back the transaction on error
        print(f"An error occurred: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving the prescription."
        )

    return {"message": "Prescription created successfully", "prescription_id": new_prescription.id}