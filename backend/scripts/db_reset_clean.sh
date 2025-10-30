#!/usr/bin/env bash
set -e

echo "🔄  Reiniciando completamente o banco de dados AVIS..."
PROJECT_ROOT="/Users/rodrigoelpidio/Avis_App/backend"
GENERATED_DIR="${PROJECT_ROOT}/python-fastapi/generated"
ENV_FILE="${PROJECT_ROOT}/python-fastapi/.env"

# ----------------------------------------------
# 1️⃣ Parar containers existentes
# ----------------------------------------------
echo "🛑  Parando containers antigos..."
docker compose -f "${PROJECT_ROOT}/docker-compose.yml" down -v || true
docker rm -f avis_postgres 2>/dev/null || true

# ----------------------------------------------
# 2️⃣ Remover volumes antigos
# ----------------------------------------------
echo "🧹  Removendo volumes antigos..."
docker volume rm backend_pgdata backend_postgres_data 2>/dev/null || true
docker volume prune -f || true

# ----------------------------------------------
# 3️⃣ Subir o novo container Postgres
# ----------------------------------------------
echo "🐳  Subindo novo container PostgreSQL..."
docker compose -f "${PROJECT_ROOT}/docker-compose.yml" up -d postgres

# Espera o banco inicializar
echo "⏳  Aguardando inicialização do PostgreSQL..."
sleep 8

# ----------------------------------------------
# 4️⃣ Testar conexão
# ----------------------------------------------
echo "🔍  Testando conexão com o banco..."
if docker exec -it avis_postgres psql -U avis_user -d avis_db -c "\conninfo"; then
  echo "✅  Banco conectado com sucesso!"
else
  echo "❌  Erro ao conectar no banco. Verifique o arquivo .env."
  exit 1
fi

# ----------------------------------------------
# 5️⃣ Aplicar migrações Alembic
# ----------------------------------------------
echo "📜  Aplicando migrações (alembic upgrade head)..."
cd "${GENERATED_DIR}"
source "${PROJECT_ROOT}/python-fastapi/.venv/bin/activate"
alembic upgrade head
deactivate

# ----------------------------------------------
# 6️⃣ Inserir usuário admin padrão
# ----------------------------------------------
echo "🌱  Inserindo usuário admin padrão..."
"${PROJECT_ROOT}/scripts/sub_seed.sh"

# ----------------------------------------------
# 7️⃣ Finalização
# ----------------------------------------------
echo "🚀  Banco resetado, migrado e pronto!"
echo "👤  Usuário admin: admin@avis.com  |  Senha: 123456"