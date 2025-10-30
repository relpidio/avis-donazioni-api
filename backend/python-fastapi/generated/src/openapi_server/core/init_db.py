# /Users/rodrigoelpidio/Avis_App/backend/python-fastapi/generated/src/openapi_server/core/init_db.py

from sqlalchemy import create_engine
from openapi_server.models.user_model import Base
import os

def init_db():
    """Cria todas as tabelas do banco de dados com base nos modelos SQLAlchemy."""
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db"
    )

    print(f"🚀 Conectando ao banco em: {database_url}")
    engine = create_engine(database_url)

    print("🧱 Criando tabelas...")
    Base.metadata.create_all(bind=engine)
    print("✅ Todas as tabelas foram criadas com sucesso!")

if __name__ == "__main__":
    init_db()
