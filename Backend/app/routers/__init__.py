from .patient import router as patient_router
from .appointment import router as appointment_router

# This list can be used in main.py to include all routers
routers = [
    patient_router,
    appointment_router
]
