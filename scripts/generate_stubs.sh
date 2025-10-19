#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OPENAPI_FILE="$ROOT/openapi/openapi.yaml"
PY_FASTAPI_OUT="$ROOT/backend/python-fastapi/generated"
NODE_EXPRESS_OUT="$ROOT/backend/nestjs/generated-express"

function has_docker() {
  command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1
}

function has_openapi_generator_cli() {
  command -v openapi-generator >/dev/null 2>&1 || command -v openapi-generator-cli >/dev/null 2>&1
}

if [ ! -f "$OPENAPI_FILE" ]; then
  echo "❌ ERRO: openapi.yaml não encontrado em $OPENAPI_FILE"
  exit 1
fi

if has_docker; then
  echo "🐳 Gerando stubs com Docker..."
  docker run --rm -v "$ROOT":/local openapitools/openapi-generator-cli generate \
    -i /local/openapi/openapi.yaml -g python-fastapi -o /local/backend/python-fastapi/generated

  docker run --rm -v "$ROOT":/local openapitools/openapi-generator-cli generate \
    -i /local/openapi/openapi.yaml -g nodejs-express-server -o /local/backend/nestjs/generated-express

  echo "✅ Stubs gerados com Docker."
  exit 0
fi

if has_openapi_generator_cli; then
  echo "🧩 Gerando stubs com OpenAPI Generator local..."
  GEN=$(command -v openapi-generator || command -v openapi-generator-cli)
  $GEN generate -i "$OPENAPI_FILE" -g python-fastapi -o "$PY_FASTAPI_OUT"
  $GEN generate -i "$OPENAPI_FILE" -g nodejs-express-server -o "$NODE_EXPRESS_OUT"
  echo "✅ Stubs gerados localmente."
  exit 0
fi

echo "⚠️ Nenhum gerador encontrado. Instale Docker ou OpenAPI Generator CLI."
exit 2
