#!/bin/zsh
# ===============================================================
# Script: setup_backend.sh
# Gerencia o backend FastAPI + PostgreSQL
# Modos: --status | --reset | --migrate | --seed | [default]
# ===============================================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
FASTAPI_DIR="$PROJECT_DIR/python-fastapi"
GENERATED_DIR="$FASTAPI_DIR/generated"
ENV_FILE="$GENERATED_DIR/.env"
ALEMBIC_DIR="$GENERATED_DIR/alembic"
PORT=8000
MODE=$1
divider="-------------------------------------------------------------"

# ---------------------------------------------------------------
# 🔍 Detectar venv automaticamente
# ---------------------------------------------------------------
function detect_venv() {
  if [ -d "$FASTAPI_DIR/venv/bin" ]; then
    echo "$FASTAPI_DIR/venv"
  elif [ -d "$FASTAPI_DIR/.venv/bin" ]; then
    echo "$FASTAPI_DIR/.venv"
  elif [ -d "$GENERATED_DIR/venv/bin" ]; then
    echo "$GENERATED_DIR/venv"
  else
    echo ""
  fi
}

# ---------------------------------------------------------------
# 🧩 Detectar porta livre
# ---------------------------------------------------------------
function find_free_port() {
  local port=$1
  while lsof -i ":$port" &>/dev/null; do
    port=$((port + 80))
  done
  echo $port
}

# ---------------------------------------------------------------
# 💣 RESET COMPLETO
# ---------------------------------------------------------------
if [ "$MODE" = "--reset" ]; then
  echo "💣 RESET COMPLETO DO AMBIENTE FASTAPI"
  echo "$divider"

  if command -v docker &>/dev/null; then
    echo "🧹 Encerrando containers Docker..."
    docker compose down -v
  fi

  VENV_DIR=$(detect_venv)
  [ -n "$VENV_DIR" ] && echo "🗑️ Removendo ambiente virtual..." && rm -rf "$VENV_DIR"

  echo "⚙️ Criando novo ambiente virtual..."
  python3 -m venv "$FASTAPI_DIR/.venv"
  VENV_DIR="$FASTAPI_DIR/.venv"
  source "$VENV_DIR/bin/activate"

  echo "📦 Instalando dependências..."
  pip install --upgrade pip &>/dev/null
  pip install "fastapi>=0.111" "uvicorn[standard]" "sqlalchemy>=2.0" psycopg2-binary \
              "passlib[bcrypt]" "pydantic[email]" "python-jose[cryptography]" alembic &>/dev/null
  echo "✅ Dependências reinstaladas."

  echo "🧩 Criando novo .env..."
  mkdir -p "$GENERATED_DIR"
  cat > "$ENV_FILE" <<EOF
# ======================================================
#  AVIS FastAPI - Configurações (.env)
# ======================================================
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRE_MINUTES=60
DATABASE_URL=postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db
EOF
  echo "✅ Novo .env criado."

  if command -v docker &>/dev/null; then
    echo "🐳 Recriando container PostgreSQL..."
    docker compose up -d --force-recreate
    sleep 3
    docker exec -it avis_postgres psql -U avis_user -d avis_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    echo "✅ Banco reinicializado."
  fi

  echo "$divider"
  echo "🔥 Reset concluído! Execute './setup_backend.sh --migrate' depois."
  exit 0
fi

# ---------------------------------------------------------------
# 🩺 STATUS
# ---------------------------------------------------------------
if [ "$MODE" = "--status" ]; then
  echo "🩺 STATUS DO AMBIENTE AVIS BACKEND"
  echo "$divider"
  VENV_DIR=$(detect_venv)
  [ -n "$VENV_DIR" ] && echo "✅ Ambiente virtual: $VENV_DIR" || echo "❌ Nenhum venv."

  if [ -f "$ENV_FILE" ]; then
    echo "✅ .env localizado"
    echo "🔑 JWT_SECRET: $(grep JWT_SECRET $ENV_FILE | cut -c1-20)..."
    echo "🗄️ DATABASE_URL: $(grep DATABASE_URL $ENV_FILE)"
  else
    echo "❌ .env ausente."
  fi

  FREE_PORT=$(find_free_port $PORT)
  [ "$FREE_PORT" = "$PORT" ] && echo "✅ Porta $PORT livre." || echo "⚠️ Porta ocupada. Próxima livre: $FREE_PORT"

  if command -v docker &>/dev/null; then
    echo "🐳 Containers Docker:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep avis_postgres || echo "   (avis_postgres não encontrado)"
  fi

  echo "$divider"
  echo "📦 Dependências Python:"
  REQUIRED=(fastapi uvicorn sqlalchemy psycopg2 passlib pydantic jose alembic)
  MISSING=()
  for pkg in "${REQUIRED[@]}"; do
    python3 -c "import importlib.util; exit(0 if importlib.util.find_spec('$pkg') else 1)" &>/dev/null || MISSING+=("$pkg")
  done
  [ ${#MISSING[@]} -eq 0 ] && echo "✅ Todas instaladas." || echo "⚠️ Faltam: ${MISSING[*]}"

  echo "$divider"
  echo "🔍 Testando conexão com banco..."
  python3 - <<'EOF'
from sqlalchemy import create_engine
import os
url = os.getenv("DATABASE_URL", "postgresql+psycopg2://avis_user:avis_password@localhost:5432/avis_db")
try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("✅ Conexão PostgreSQL ok.")
except Exception as e:
    print(f"❌ Falha ao conectar: {e}")
EOF
  echo "$divider"
  exit 0
fi

# ---------------------------------------------------------------
# 🧱 MIGRAÇÕES ALEMBIC
# ---------------------------------------------------------------
if [ "$MODE" = "--migrate" ]; then
  echo "🧱 EXECUTANDO MIGRAÇÕES DO ALEMBIC"
  echo "$divider"

  VENV_DIR=$(detect_venv)
  [ -z "$VENV_DIR" ] && echo "❌ Nenhum venv. Rode ./setup_backend.sh --reset" && exit 1
  source "$VENV_DIR/bin/activate"
  export $(grep -v '^#' "$ENV_FILE" | xargs)

  if [ ! -d "$ALEMBIC_DIR" ]; then
    echo "⚙️ Inicializando estrutura Alembic..."
    alembic init "$ALEMBIC_DIR" &>/dev/null
  fi

  sed -i '' "s#sqlalchemy.url = .*\$#sqlalchemy.url = '${DATABASE_URL}'#g" "$ALEMBIC_DIR/alembic.ini" 2>/dev/null
  echo "📜 Executando upgrade..."
  alembic -c "$ALEMBIC_DIR/alembic.ini" upgrade head
  echo "✅ Migrações aplicadas!"
  echo "$divider"
  exit 0
fi

# ---------------------------------------------------------------
# 🌱 SEED - Criar usuário admin padrão
# ---------------------------------------------------------------
if [ "$MODE" = "--seed" ]; then
  echo "🌱 INSERINDO USUÁRIO ADMIN PADRÃO"
  echo "$divider"

  VENV_DIR=$(detect_venv)
  [ -z "$VENV_DIR" ] && echo "❌ Nenhum venv. Rode ./setup_backend.sh --reset" && exit 1
  source "$VENV_DIR/bin/activate"
  export $(grep -v '^#' "$ENV_FILE" | xargs)

  python3 - <<'EOF'
from sqlalchemy import create_engine, text
from passlib.hash import bcrypt
import os

url = os.getenv("DATABASE_URL")
engine = create_engine(url)
admin_email = "admin@avis.com"
admin_pass = bcrypt.hash("123456")

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM users WHERE email=:email"), {"email": admin_email}).fetchone()
    if result:
        print(f"⚠️ Usuário admin já existe ({admin_email})")
    else:
        conn.execute(text("""
            INSERT INTO users (email, hashed_password, full_name, is_active)
            VALUES (:email, :hashed_password, 'Administrador', TRUE)
        """), {"email": admin_email, "hashed_password": admin_pass})
        conn.commit()
        print(f"✅ Usuário admin criado: {admin_email} / 123456")
EOF
  echo "$divider"
  exit 0
fi

# ---------------------------------------------------------------
# 🚀 EXECUÇÃO PADRÃO
# ---------------------------------------------------------------
echo "🚀 Iniciando backend FastAPI..."
VENV_DIR=$(detect_venv)
[ -z "$VENV_DIR" ] && echo "❌ Nenhum venv. Rode ./setup_backend.sh --reset" && exit 1
source "$VENV_DIR/bin/activate"
export $(grep -v '^#' "$ENV_FILE" | xargs)

PORT=$(find_free_port $PORT)
echo "✅ Porta disponível: $PORT"

if command -v docker &>/dev/null; then
  echo "🐳 Subindo PostgreSQL..."
  docker compose up -d
fi

echo "🔍 Testando conexão..."
python3 - <<'EOF'
from sqlalchemy import create_engine
import os
url = os.getenv("DATABASE_URL")
try:
    engine = create_engine(url)
    with engine.connect() as conn:
        print("✅ Conexão PostgreSQL verificada!")
except Exception as e:
    print(f"❌ Erro ao conectar: {e}")
EOF

echo "🌐 Iniciando servidor FastAPI..."
cd "$GENERATED_DIR"
uvicorn openapi_server.main:app --app-dir src --host 0.0.0.0 --port $PORT --reload

