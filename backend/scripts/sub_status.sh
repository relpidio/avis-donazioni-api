#!/bin/zsh
echo "🩺 STATUS DO BACKEND AVIS"
cd "$(dirname "$0")/.."
FASTAPI_DIR="$PWD/python-fastapi"
GENERATED_DIR="$FASTAPI_DIR/generated"
ENV_FILE="$GENERATED_DIR/.env"

divider="-------------------------------------------------------------"
VENV="$FASTAPI_DIR/.venv"

echo "$divider"
if [ -d "$VENV" ]; then
  echo "✅ Ambiente virtual: $VENV"
else
  echo "❌ Nenhum ambiente virtual encontrado."
fi

if [ -f "$ENV_FILE" ]; then
  echo "✅ Variáveis .env:"
  grep -E "JWT_SECRET|DATABASE_URL" "$ENV_FILE"
else
  echo "❌ Arquivo .env não encontrado."
fi

echo "$divider"
echo "🐳 Containers Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep avis_postgres || echo "   (PostgreSQL não encontrado)"

echo "$divider"
echo "📦 Dependências instaladas:"
source "$VENV/bin/activate"
pip freeze | grep -E "fastapi|uvicorn|sqlalchemy|psycopg2|passlib|jose|alembic|httpx"
echo "$divider"
