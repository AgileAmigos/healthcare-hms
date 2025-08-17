from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from . import crud, models, schemas, security
from .database import get_db

# This tells FastAPI where to get the token from.
# The tokenUrl should point to the endpoint where the user logs in to get a token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> models.User:
    """
    Decodes the JWT token to get the current user.

    This function is a dependency that can be used in path operations to
    protect routes and get the authenticated user.

    Args:
        token: The OAuth2 token provided by the client.
        db: The database session dependency.

    Raises:
        HTTPException: If the token is invalid, expired, or the user
                       does not exist.

    Returns:
        The authenticated user object from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token using the secret key and algorithm
        payload = jwt.decode(
            token, security.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception

    # Fetch the user from the database
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    
    return user

def get_current_active_doctor(current_user: models.User = Depends(get_current_user)):
    """
    Dependency to ensure the current user is a doctor.
    """
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Not enough permissions, Doctor role required.")
    return current_user

def get_current_active_staff(current_user: models.User = Depends(get_current_user)):
    """
    Dependency to ensure the current user is a doctor or a nurse.
    """
    if current_user.role not in ["doctor", "nurse"]:
        raise HTTPException(status_code=403, detail="Not enough permissions, Doctor or Nurse role required.")
    return current_user

