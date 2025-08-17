# backend/app/models.py
import uuid
from sqlalchemy import Column, Integer, String, Date, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# This mirrors the gender_type ENUM from your SQL schema
gender_type_enum = Enum('Male', 'Female', 'Other', 'Prefer not to say', name='gender_type')

class Patient(Base):
    __tablename__ = "patients"
    
    # This tells SQLAlchemy to create this table in the 'public' schema.
    # It's good practice, especially if you have multiple schemas.
    __table_args__ = {"schema": "public"}

    # --- Column definitions matching your SQL schema ---
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=True) # Assuming this can be null
    
    # NOTE: Your SQL has a 'digital_health_id'. You may want to add it here.
    # digital_health_id = Column(String(50), unique=True, nullable=False)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(gender_type_enum)
    phone_number = Column(String(20))
    address = Column(String) # Use String for TEXT
    
    # --- Simplified for now, add these back if needed ---
    # emergency_contact_name = Column(String(100))
    # emergency_contact_phone = Column(String(20))
    # created_at = Column(TIMESTAMP(timezone=True), default=func.now())
    # updated_at = Column(TIMESTAMP(timezone=True), default=func.now(), onupdate=func.now())

    # --- These are from your simpler, initial design ---
    presenting_complaint = Column(String)
    triage_level = Column(String, nullable=True)