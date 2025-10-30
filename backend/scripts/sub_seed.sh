#!/usr/bin/env bash
set -e

echo "🌱 INSERINDO USUÁRIO ADMIN PADRÃO..."

# Caminhos corretos
PROJECT_ROOT="/Users/rodrigoelpidio/Avis_App/backend"
ENV_FILE="${PROJECT_ROOT}/python-fastapi/.env"
VENV_PY="${PROJECT_ROOT}/python-fastapi/.venv/bin/python3"
PYTHONPATH_DIR="${PROJECT_ROOT}/python-fastapi/generated/src"

# 1️⃣ Carrega o .env de forma segura
if [ -f "$ENV_FILE" ]; then
  echo "📦 Carregando variáveis de ambiente de $ENV_FILE"
  set -a
  source "$ENV_FILE"
  set +a
else
  echo "⚠️  Arquivo .env não encontrado em: $ENV_FILE"
  exit 1
fi

# 2️⃣ Força a criação correta da URL de conexão
DB_HOST="${POSTGRES_HOST:-127.0.0.1}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_USER="${POSTGRES_USER:-avis_user}"
DB_PASS="${POSTGRES_PASSWORD:-avis_password}"
DB_NAME="${POSTGRES_DB:-avis_db}"

DATABASE_URL="postgresql+psycopg2://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
export DATABASE_URL

echo "🔗 Conectando ao banco: $DATABASE_URL"

# 3️⃣ Executa o Python com o PYTHONPATH correto
PYTHONPATH="$PYTHONPATH_DIR" "$VENV_PY" <<'EOF'
import os, sys, traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.hash import bcrypt

pp = os.getenv("PYTHONPATH")
if pp and pp not in sys.path:
    sys.path.insert(0, pp)

try:
    from openapi_server.models import User
except Exception:
    print("❌ Erro ao importar User de openapi_server.models")
    traceback.print_exc()
    raise

DB_URL = os.getenv("DATABASE_URL")
print(f"🧪 DATABASE_URL = {DB_URL}")

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine)

try:
    session = SessionLocal()
    admin = session.query(User).filter_by(email="admin@avis.com").first()
    if not admin:
        print("👤 Criando usuário admin padrão...")
        admin = User(
            email="admin@avis.com",
            hashed_password=bcrypt.hash("123456"),
            full_name="Administrador",
            role="admin",
            is_active=True
        )
        session.add(admin)
        session.commit()
        print("✅ Usuário admin criado com sucesso!")
    else:
        print("ℹ️  Usuário admin já existe, nada a fazer.")
finally:
    session.close()
EOF