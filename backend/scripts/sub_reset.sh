#!/bin/zsh
echo "💣 RESETANDO AMBIENTE COMPLETO..."
cd "$(dirname "$0")/.."

FASTAPI_DIR="$PWD/python-fastapi"
GENERATED_DIR="$FASTAPI_DIR/generated"
ENV_FILE="$GENERATED_DIR/.env"

# Apagar ambiente virtual antigo
[ -d "$FASTAPI_DIR/.venv" ] && rm -rf "$FASTAPI_DIR/.venv"
python3 -m venv "$FASTAPI_DIR/.venv"
source "$FASTAPI_DIR/.venv/bin/activate"

echo "📦 Instalando dependências..."
pip install --upgrade pip
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary passlib[bcrypt] \
            pydantic[email] python-jose[cryptography] alembic httpx

echo "🧩 Criando novo arquivo .env..."
mkdir -p "$GENERATED_DIR"
cat > "$ENV_FILE" <<EOF
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE_MINUTES=60
DATABASE_URL=postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db
EOF
echo "✅ .env criado em $ENV_FILE"

echo "🐳 Reiniciando container PostgreSQL..."
docker compose down -v
docker compose up -d --force-recreate
sleep 3

echo "✅ Ambiente recriado com sucesso!"
