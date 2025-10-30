from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 🔑 Lê DATABASE_URL do .env (padrão PostgreSQL Docker)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://avis_user:avis_pass@localhost:5432/avis_db")

# 🔌 Cria o engine de conexão
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# 🧱 Cria a fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 🧩 Base para os modelos ORM
Base = declarative_base()

# ✅ Dependência FastAPI para obter a sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()