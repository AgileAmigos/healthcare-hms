from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import healthcheck, patients 
from .models import Base
from .db import engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Multicare HMS API",
    description="Backend API for Multicare Hospital Management System",
    version="0.1.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(healthcheck.router)
app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "Welcome to Multicare HMS API"}