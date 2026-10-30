#!/usr/bin/env bash

set -e

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker não encontrado. Instale o Docker antes de continuar."
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose não encontrado."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "O Docker não está em execução ou o usuário não possui permissão."
    exit 1
fi

if [ ! -f .env ]; then
    cp .env.example .env
    echo "Arquivo .env criado."
fi

echo "Iniciando a aplicação..."

docker compose up --build -d --wait

echo ""
echo "Aplicação iniciada!"
echo "API disponível em http://localhost:3000/contatos"