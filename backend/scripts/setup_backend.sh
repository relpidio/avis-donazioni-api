#!/bin/bash
set -e

PROJECT_DIR="/Users/rodrigoelpidio/Avis_App/backend/python-fastapi"
GENERATED_DIR="$PROJECT_DIR/generated"
VENV_DIR="$PROJECT_DIR/.venv"
ENV_FILE="$PROJECT_DIR/.env"

echo "🚀 Iniciando backend FastAPI com verificação de ambiente e dependências..."

# ==========================================================
# 1️⃣ Verificar e ativar ambiente virtual
# ==========================================================
if [ -d "$VENV_DIR" ]; then
  echo "✅ Ambiente virtual detectado em: $VENV_DIR"
else
  echo "❌ Ambiente virtual não encontrado, criando novo..."
  python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

# Atualizar pip
pip install --upgrade pip >/dev/null

# ==========================================================
# 2️⃣ Instalar dependências principais
# ==========================================================
echo "📦 Instalando dependências principais..."
pip install --quiet \
  "fastapi>=0.111" "uvicorn[standard]" "sqlalchemy>=2.0" "psycopg2-binary" \
  "pydantic[email]" "passlib[argon2,bcrypt]" "python-jose[cryptography]" "python-multipart"

# ==========================================================
# 3️⃣ Gerar arquivo .env se não existir
# ==========================================================
if [ ! -f "$ENV_FILE" ]; then
  echo "🧩 Criando arquivo .env padrão..."
  cat <<EOF > "$ENV_FILE"
POSTGRES_USER=avis_user
POSTGRES_PASSWORD=avis_password
POSTGRES_DB=avis_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

DATABASE_URL=postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db
JWT_SECRET=$(openssl rand -hex 32)
EOF
else
  echo "✅ Arquivo .env já existe — mantendo configuração atual."
fi

# ==========================================================
# 4️⃣ Carregar variáveis do .env no ambiente
# ==========================================================
export $(grep -v '^#' "$ENV_FILE" | xargs)

# ==========================================================
# 5️⃣ Subir container do PostgreSQL
# ==========================================================
echo "🐳 Subindo container PostgreSQL..."
docker compose -f "$PROJECT_DIR/../docker-compose.yml" up -d

# ==========================================================
# 6️⃣ Testar conexão com o banco
# ==========================================================
echo "🧱 Verificando conexão com banco..."
python - <<PYCODE
from sqlalchemy import create_engine
import os, time

url = os.getenv("DATABASE_URL", "postgresql+psycopg2://avis_user:avis_password@127.0.0.1:5432/avis_db")
print(f"🔗 Testando conexão com: {url}")
time.sleep(3)
try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("✅ Conectado ao banco com sucesso!")
except Exception as e:
    print("❌ Erro ao conectar ao banco:", e)
PYCODE

# ==========================================================
# 7️⃣ Iniciar servidor FastAPI
# ==========================================================
echo "🌐 Iniciando servidor FastAPI..."
cd "$GENERATED_DIR"
uvicorn openapi_server.main:app --app-dir src --host 0.0.0.0 --port 8000 --reload