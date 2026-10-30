#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

ACTION="${1:-setup}"

check_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker não encontrado. Instale o Docker antes de continuar."
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

check_docker

case "$ACTION" in
  setup)
    if [ ! -f .env ]; then
      cp .env.example .env
      echo "Arquivo .env criado."
    fi

    echo "Construindo e iniciando a aplicação..."
    docker compose up --build -d --wait

    echo ""
    echo "Aplicação iniciada com sucesso!"
    echo "API disponível em http://localhost:3000/contatos"
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
    LOG_FILE=$(mktemp)

    cleanup() {
      echo ""
      echo "[4/4] Removendo ambiente de testes..."

      docker compose -f compose.test.yaml -p contatos-tests down -v \
        > /dev/null 2>&1 || true

      rm -f "$LOG_FILE"
    }

    trap cleanup EXIT

    echo "[1/4] Preparando ambiente de testes..."

    if ! docker compose -f compose.test.yaml -p contatos-tests build \
      > "$LOG_FILE" 2>&1; then
      echo "Erro ao construir o ambiente de testes:"
      cat "$LOG_FILE"
      exit 1
    fi

    echo "[2/4] Inicializando banco de dados..."

    if ! docker compose -f compose.test.yaml -p contatos-tests up \
      -d --wait mysql-test > "$LOG_FILE" 2>&1; then
      echo "Erro ao inicializar o banco de testes:"
      cat "$LOG_FILE"
      docker compose -f compose.test.yaml -p contatos-tests logs mysql-test
      exit 1
    fi

    echo "[3/4] Executando testes..."
    echo ""

    if docker compose -f compose.test.yaml -p contatos-tests run \
      --rm --no-deps -T tests npm test; then
      echo ""
      echo "Todos os testes passaram."
    else
      echo ""
      echo "Falha na execução dos testes."
      exit 1
    fi
    ;;

  *)
    echo "Uso: ./setup.sh {setup|start|stop|restart|test}"
    exit 1
    ;;
esac