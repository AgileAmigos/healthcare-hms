from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from .routes import healthcheck, patients
from .models import Base
from .db import engine

# Create tables automatically (for dev; use Alembic in prod)
Base.metadata.create_all(bind=engine)

# FastAPI app instance
app = FastAPI(
    title="Multicare HMS API",
    description="Backend API for Multicare Hospital Management System",
    version="0.1.0"
)

# CORS settings
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # restrict to frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(healthcheck.router)
app.include_router(patients.router)

# Root
@app.get("/")
def root():
    return {"message": "Welcome to Multicare HMS API"}
