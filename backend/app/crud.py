from sqlalchemy.orm import Session
from . import models, schemas, security
from typing import Optional

def get_user_by_email(db: Session, email: str):

    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):

    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user



def get_patient(db: Session, patient_id: int):
    
    return db.query(models.Patient).filter(models.Patient.patient_id == patient_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
  
    return db.query(models.Patient).offset(skip).limit(limit).all()

def create_patient(db: Session, patient: schemas.PatientCreate, user_id: int):

    db_patient = models.Patient(**patient.model_dump(), registered_by=user_id)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_high_priority_patients(db: Session):
    high_priority_levels = ["Resuscitation", "Emergency"]
    return db.query(models.Patient).filter(models.Patient.triage_level.in_(high_priority_levels)).all()

def update_patient_triage_level(db: Session, patient_id: int, triage_level: Optional[str]):
    db_patient = get_patient(db, patient_id)
    if db_patient:
        db_patient.triage_level = triage_level
        db.commit()
        db.refresh(db_patient)
    return db_patient

def get_beds(db: Session, skip: int = 0, limit: int = 100):
    

    return db.query(models.Bed).offset(skip).limit(limit).all()

def get_bed(db: Session, bed_id: int):

    return db.query(models.Bed).filter(models.Bed.bed_id == bed_id).first()


def update_bed(db: Session, bed_id: int, bed_update: schemas.BedUpdate):

    db_bed = get_bed(db, bed_id)
    if db_bed:
        db_bed.is_occupied = bed_update.is_occupied
        db_bed.patient_id = bed_update.patient_id
        db.commit()
        db.refresh(db_bed)
    return db_bed



def create_appointment(db: Session, appointment: schemas.AppointmentCreate):

    db_appointment = models.Appointment(
        patient_id=appointment.patient_id,
        appointment_date=appointment.appointment_date,
        reason=appointment.reason,
        status='pending'
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointments(db: Session, skip: int = 0, limit: int = 100):

    return db.query(models.Appointment).offset(skip).limit(limit).all()


def create_prescription(db: Session, prescription: schemas.PrescriptionCreate, doctor_id: int):

    db_prescription = models.Prescription(
        **prescription.model_dump(),
        doctor_id=doctor_id
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription

def get_prescriptions_for_patient(db: Session, patient_id: int):
 
    return db.query(models.Prescription).filter(models.Prescription.patient_id == patient_id).all()



def create_document(db: Session, patient_id: int, file_name: str, file_path: str, user_id: int, document_type: str):
 
    db_document = models.Document(
        patient_id=patient_id,
        document_name=file_name,
        storage_path=file_path,
        uploaded_by=user_id,
        document_type=document_type
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def get_documents_for_patient(db: Session, patient_id: int):

    return db.query(models.Document).filter(models.Document.patient_id == patient_id).all()

