#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OPENAPI_FILE="\$ROOT/openapi/openapi.yaml"

# Example commands (requires docker)
# Generate python-fastapi server stub:
docker run --rm -v "\$ROOT":/local openapitools/openapi-generator-cli generate \
  -i /local/openapi/openapi.yaml -g python-fastapi -o /local/backend/python-fastapi/generated

# Generate nodejs express (base to adapt to NestJS):
docker run --rm -v "\$ROOT":/local openapitools/openapi-generator-cli generate \
  -i /local/openapi/openapi.yaml -g nodejs-express-server -o /local/backend/nestjs/generated-express

echo "Stubs generated under backend/*/generated"
