from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from dotenv import load_dotenv

# ---------------------------------------------------------
# 🔧 Carregar variáveis do .env
# ---------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src"))
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENV_PATH = os.path.join(PROJECT_ROOT, "python-fastapi", ".env")
load_dotenv(ENV_PATH)

sys.path.append(BASE_DIR)

from openapi_server.database import Base, engine
from openapi_server import models
from openapi_server.models import Base 

# ---------------------------------------------------------
# 📦 Configuração do Alembic
# ---------------------------------------------------------
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ---------------------------------------------------------
# 🔗 Montar string de conexão segura (IPv4 + .env correto)
# ---------------------------------------------------------
db_user = os.getenv("POSTGRES_USER", "avis_user")
db_pass = os.getenv("POSTGRES_PASSWORD", "avis_password")
db_host = os.getenv("POSTGRES_HOST", "127.0.0.1")  # ⚠️ força IPv4
db_port = os.getenv("POSTGRES_PORT", "5432")
db_name = os.getenv("POSTGRES_DB", "avis_db")

DATABASE_URL = f"postgresql+psycopg2://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"
config.set_main_option("sqlalchemy.url", DATABASE_URL)
print(f"🔗 Alembic usando: {DATABASE_URL}")

target_metadata = Base.metadata

# ---------------------------------------------------------
# ⚙️ Migrações
# ---------------------------------------------------------
def run_migrations_offline():
    """Executa migrações no modo offline."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Executa migrações no modo online."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()