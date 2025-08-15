from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import healthcheck

# Create the app instance
app = FastAPI(
    title="Multicare HMS API",
    description="Backend API for Multicare Hospital Management System",
    version="0.1.0"
)

# CORS Middleware (allow frontend to communicate)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(healthcheck.router)

# Root welcome route
@app.get("/")
def root():
    return {"message": "Welcome to Multicare HMS API"}
