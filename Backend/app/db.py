from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Get database URL from config
DATABASE_URL = settings.DATABASE_URL

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True, future=True)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Safe table creation function
def create_tables():
    """
    Creates all tables that are defined via SQLAlchemy models.
    Does NOT drop existing tables. Safe for use with a live database.
    """
    Base.metadata.create_all(bind=engine, checkfirst=True)
