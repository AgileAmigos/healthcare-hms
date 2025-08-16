from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import healthcheck, patients # 👈 Import the new patients router
from . import models # 👈 Import your SQLAlchemy models
from .db import engine # 👈 Import the database engine

# This command creates your database tables if they don't already exist
models.Base.metadata.create_all(bind=engine)

# Create the app instance
app = FastAPI(
    title="Multicare HMS API",
    description="Backend API for Multicare Hospital Management System",
    version="0.1.0"
)

# CORS Middleware (allow frontend to communicate)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you should restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(healthcheck.router)
app.include_router(patients.router) # 👈 Add the router for patient endpoints

# Root welcome route
@app.get("/")
def root():
    return {"message": "Welcome to Multicare HMS API"}