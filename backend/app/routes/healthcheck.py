from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health Check"])

@router.get("/")
def health_check():
    """
    Simple endpoint to check if the API is running.
    """
    return {"status": "healthy"}
