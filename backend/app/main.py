from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models
from .routers import (
    auth,
    patients,
    appointments,
    beds,
    prescriptions,
    documents
)

models.Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Hospital Management System API",
    description="API for a minimal Hospital Management System.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(appointments.router)
app.include_router(beds.router)
app.include_router(prescriptions.router)
app.include_router(documents.router)


@app.get("/", tags=["Root"])
def read_root():
    
    return {"message": "Welcome to the Hospital Management System API"}

