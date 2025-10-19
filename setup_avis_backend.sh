#!/bin/bash
# ============================================================
#  AVIS Donazioni - Setup Backend (NestJS + Python FastAPI)
#  Autor: ChatGPT (para Rodrigo)
#  Caminho: /Users/rodrigoelpidio/Avis_App/setup_avis_backend.sh
# ============================================================

set -e

PROJECT_ROOT="/Users/rodrigoelpidio/Avis_App"
OPENAPI_SPEC="$PROJECT_ROOT/openapi/openapi.yaml"

# ------------------------------------------------------------
# Funções auxiliares
# ------------------------------------------------------------

msg() {
  echo -e "\033[1;34m[AVIS Setup]\033[0m $1"
}

check_cmd() {
  command -v "$1" >/dev/null 2>&1
}

# ------------------------------------------------------------
# 1. Criar estrutura de diretórios
# ------------------------------------------------------------

msg "Criando estrutura de diretórios..."

mkdir -p "$PROJECT_ROOT"/{backend/{python-fastapi,nestjs},openapi,scripts,.github/workflows}

# ------------------------------------------------------------
# 2. Criar arquivo README base
# ------------------------------------------------------------
cat > "$PROJECT_ROOT/README.md" <<'EOF'
# AVIS Donazioni - Backend

Este projeto implementa o backend do aplicativo **AVIS Donazioni**, inspirado no **NHS GiveBlood (UK)**, para a Itália.

## Estrutura

- **openapi/** → Especificação OpenAPI YAML  
- **backend/python-fastapi/** → Stubs de servidor Python (FastAPI)  
- **backend/nestjs/** → Estrutura NestJS (TypeScript)  
- **scripts/** → Utilitários de automação  
- **.github/workflows/** → CI/CD

## Ferramentas necessárias

- Docker Desktop (ou OpenAPI Generator via Homebrew)
- Node.js 20+
- Python 3.10+
- Git

## Execução

```bash
./scripts/generate_stubs.sh

# =========================================================
# 3. Geração automática de stubs OpenAPI (Docker ou Brew fallback)
# =========================================================
echo ""
echo "[Generator] Verificando Docker e OpenAPI Generator..."

if command -v docker &> /dev/null; then
  echo "[Generator] Usando Docker para gerar stubs..."

  docker run --rm -v "$(pwd)":/local openapitools/openapi-generator-cli generate \
    -i /local/openapi/openapi.yaml -g python-fastapi -o /local/backend/python-fastapi/generated

  docker run --rm -v "$(pwd)":/local openapitools/openapi-generator-cli generate \
    -i /local/openapi/openapi.yaml -g nodejs-express-server -o /local/backend/nestjs/generated-express

elif command -v openapi-generator &> /dev/null; then
  echo "[Generator] Usando instalação local do OpenAPI Generator..."

  openapi-generator generate -i ./openapi/openapi.yaml -g python-fastapi -o ./backend/python-fastapi/generated
  openapi-generator generate -i ./openapi/openapi.yaml -g nodejs-express-server -o ./backend/nestjs/generated-express
else
  echo "[ERRO] Nenhum gerador OpenAPI encontrado. Instale Docker Desktop ou OpenAPI Generator CLI."
  exit 1
fi

echo "✅ Stubs OpenAPI gerados com sucesso!"

# =========================================================
# 4. Criar backend Python base
# =========================================================
echo ""
echo "[Python Backend] Criando ambiente e dependências..."

cd backend/python-fastapi || exit 1
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn pydantic
deactivate

echo "✅ Ambiente Python criado com sucesso!"

# =========================================================
# 5. Criar estrutura NestJS base
# =========================================================
echo ""
echo "[NestJS Backend] Configurando base do projeto..."

cd ../../nestjs || exit 1
npm init -y
npm install -g @nestjs/cli
nest new avis-nest-backend --skip-git --package-manager npm

echo "✅ Estrutura NestJS criada!"

# =========================================================
# 6. Criar workflow GitHub Actions
# =========================================================
echo ""
echo "[GitHub Actions] Criando workflow de build/test..."

mkdir -p ../../.github/workflows
cat <<'EOF' > ../../.github/workflows/backend-ci.yml
name: AVIS Backend CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install FastAPI deps
        run: |
          cd backend/python-fastapi
          python3 -m venv venv
          source venv/bin/activate
          pip install -r requirements.txt || pip install fastapi uvicorn pydantic

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install NestJS deps
        run: |
          cd backend/nestjs/avis-nest-backend
          npm install

      - name: Run tests
        run: echo "TODO: Add tests here"
EOF

echo "✅ Workflow GitHub Actions criado!"
echo ""
echo "🚀 Setup completo do AVIS Backend finalizado!"

