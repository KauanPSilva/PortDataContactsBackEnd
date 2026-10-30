#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

ACTION="${1:-setup}"

check_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker não encontrado."
    exit 1
  fi

  if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose não encontrado."
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "Docker não está em execução ou o usuário não possui permissão."
    exit 1
  fi
}

if [ "$ACTION" != "test" ]; then
  check_docker
fi

case "$ACTION" in
  setup)
    if [ ! -f .env ]; then
      cp .env.example .env
      echo "Arquivo .env criado."
    fi

    echo "Construindo e iniciando a aplicação..."
    docker compose up --build -d --wait

    echo "Aplicação disponível em http://localhost:3000/contatos"
    ;;

  start)
    echo "Iniciando a aplicação..."
    docker compose start
    echo "Aplicação iniciada!"
    ;;

  stop)
    echo "Parando a aplicação..."
    docker compose stop
    echo "Aplicação parada!"
    ;;

  restart)
    echo "Reiniciando a aplicação..."
    docker compose restart
    echo "Aplicação reiniciada!"
    ;;

    test)
    echo "Executando os testes..."
    npm test
    ;;

  *)
    echo "Uso: ./setup.sh {setup|start|stop|restart}"
    exit 1
    ;;
esac