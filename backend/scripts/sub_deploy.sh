#!/bin/zsh
echo "🚀 BUILD E DEPLOY DOCKER BACKEND..."
cd "$(dirname "$0")/.."

docker build -t avis_backend:dev -f ./python-fastapi/Dockerfile .
docker tag avis_backend:dev avis_backend:latest

echo "🐳 Imagens criadas:"
docker images | grep avis_backend

echo "🌐 Subindo containers..."
docker compose up -d

echo "✅ Deploy completo!"
