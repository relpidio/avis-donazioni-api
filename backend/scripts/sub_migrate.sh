#!/bin/zsh
echo "🧱 EXECUTANDO MIGRAÇÕES ALEMBIC..."
cd "$(dirname "$0")/.."

FASTAPI_DIR="$PWD/python-fastapi"
GENERATED_DIR="$FASTAPI_DIR/generated"
ALEMBIC_DIR="$GENERATED_DIR/alembic"
ENV_FILE="$GENERATED_DIR/.env"

source "$FASTAPI_DIR/.venv/bin/activate"
export $(grep -v '^#' "$ENV_FILE" | xargs)

if [ ! -d "$ALEMBIC_DIR" ]; then
  alembic init "$ALEMBIC_DIR"
fi

sed -i '' "s#sqlalchemy.url = .*\$#sqlalchemy.url = ${DATABASE_URL}#g" "$ALEMBIC_DIR/alembic.ini"
alembic -c "$ALEMBIC_DIR/alembic.ini" upgrade head
echo "✅ Migrações aplicadas com sucesso!"
