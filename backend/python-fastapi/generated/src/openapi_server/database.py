from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# URL do banco (pode vir do .env)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://avis_user:avis_pass@localhost:5432/avis_db"
)

# Cria engine
engine = create_engine(DATABASE_URL)

# Cria sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()


# Dependência para injetar sessão no FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
