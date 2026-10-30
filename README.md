# PortData Contacts API

API REST para gerenciamento de contatos, desenvolvida como parte de um desafio técnico de Backend.

A aplicação permite cadastrar, listar, atualizar e excluir contatos, com persistência em MySQL, validação dos dados recebidos e testes automatizados.

### Tecnologias

![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.4-4479A1?logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

## Índice

1. [Funcionalidades](#funcionalidades)
2. [Pré-requisitos](#pré-requisitos)
3. [Execução com Docker](#execução-com-docker)
4. [Execução com Node.js](#execução-com-nodejs)
5. [Configuração do MySQL](#configuração-do-mysql)
6. [Endpoints](#endpoints)
7. [Validações](#validações)
8. [Testes automatizados](#testes-automatizados)
9. [Estrutura do projeto](#estrutura-do-projeto)

---

## Funcionalidades

A API disponibiliza operações CRUD para contatos:

- **Criar:** cadastrar um contato com nome e telefone.
- **Listar:** consultar os contatos cadastrados.
- **Atualizar:** modificar os dados de um contato existente.
- **Excluir:** remover um contato pelo identificador.

A aplicação utiliza uma arquitetura em camadas, separando o tratamento das requisições HTTP, as regras de negócio e o acesso ao banco de dados.

## Pré-requisitos

Existem duas formas de executar a aplicação.

| Execução | Requisitos |
|---|---|
| Docker (recomendada) | Docker Engine e Docker Compose |
| Node.js | Node.js 24, npm e MySQL 8.4 |

O ambiente Docker inicializa automaticamente a API e o banco de dados.

A execução direta pelo Node.js exige uma instância MySQL previamente configurada.

## Execução com Docker

### 1. Clonar o repositório

Clone este repositório e acesse o diretório do projeto.

```bash
cd PortDataContactsBackEnd
```

### 2. Inicializar a aplicação

Em Linux, macOS ou WSL, execute:

```bash
./manage.sh setup
```

O script realiza automaticamente as seguintes operações:

1. Verifica a disponibilidade do Docker.
2. Cria o arquivo `.env` a partir de `.env.example`, caso ainda não exista.
3. Constrói a imagem da aplicação.
4. Inicializa o container MySQL.
5. Cria o banco e a tabela necessários.
6. Inicia a API após a verificação de disponibilidade do banco.

Após a inicialização, a API estará disponível em:

**`http://localhost:3000/contatos`**

> O Docker utiliza a porta `3000` para a API e publica o MySQL localmente na porta `3306`. Essas portas precisam estar disponíveis.

### Comandos de gerenciamento

O arquivo `manage.sh` centraliza as operações do ambiente.

| Comando | Descrição |
|---|---|
| `./manage.sh setup` | Configura, constrói e inicia a aplicação |
| `./manage.sh start` | Inicia os containers existentes |
| `./manage.sh stop` | Interrompe os containers |
| `./manage.sh restart` | Reinicia os containers existentes |
| `./manage.sh test` | Executa os testes automatizados |

O comando `stop` não exclui os dados armazenados no MySQL.

Para aplicar alterações no código da aplicação executada em Docker, utilize novamente:

```bash
./manage.sh setup
```

### Alternativa sem o script Bash

Em ambientes com Docker Compose, também é possível iniciar a aplicação diretamente.

Primeiro, crie o arquivo de configuração:

```bash
cp .env.example .env
```

Depois, execute:

```bash
docker compose up --build -d --wait
```

Para interromper os containers:

```bash
docker compose stop
```

---

## Execução com Node.js

A aplicação também pode ser executada diretamente, sem utilizar Docker para o servidor Node.js.

### 1. Instalar as dependências

Na raiz do projeto:

```bash
npm ci
```

### 2. Configurar as variáveis de ambiente

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Configure os dados de conexão de acordo com sua instalação do MySQL.

### 3. Preparar o banco de dados

Certifique-se de que o serviço MySQL esteja em execução e siga as instruções da seção [Configuração do MySQL](#configuração-do-mysql).

### 4. Iniciar a aplicação

```bash
npm start
```

Para executar em modo de desenvolvimento, com reinicialização automática ao alterar arquivos:

```bash
npm run dev
```

A API estará disponível em:

**`http://localhost:3000/contatos`**

---

## Configuração do MySQL

A conexão com o banco de dados é configurada por variáveis de ambiente.

### Variáveis disponíveis

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta HTTP da aplicação | `3000` |
| `DB_HOST` | Endereço do servidor MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_USER` | Usuário do banco | `contatos_user` |
| `DB_PASSWORD` | Senha do usuário | `contatos_dev_password` |
| `DB_NAME` | Nome do banco | `contatos_db` |
| `MYSQL_ROOT_PASSWORD` | Senha do administrador usada na inicialização Docker | `root_dev_password` |

### Exemplo de `.env`

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=contatos_user
DB_PASSWORD=contatos_dev_password
DB_NAME=contatos_db

MYSQL_ROOT_PASSWORD=root_dev_password
```

Os valores acima são destinados exclusivamente ao desenvolvimento local. Para outros ambientes, utilize credenciais próprias.

O arquivo `.env` não deve ser versionado.

### Configuração automática com Docker

Ao utilizar `./manage.sh setup`, o Docker Compose configura automaticamente:

- O servidor MySQL.
- O banco definido por `DB_NAME`.
- O usuário e a senha definidos no `.env`.
- A estrutura inicial das tabelas, por meio de `database/init.sql`.

Dentro da rede Docker, a aplicação utiliza `mysql` como endereço do banco.

Os dados do MySQL são armazenados em um volume persistente, preservando os registros entre reinicializações.

### Configuração manual do MySQL

Para executar a aplicação diretamente pelo Node.js, é necessário disponibilizar um banco e um usuário com permissões adequadas.

Acesse o MySQL com uma conta administrativa:

```bash
mysql -u root -p
```

Crie o banco e o usuário de desenvolvimento:

```sql
CREATE DATABASE IF NOT EXISTS contatos_db;

CREATE USER IF NOT EXISTS 'contatos_user'@'localhost'
IDENTIFIED BY 'contatos_dev_password';

GRANT ALL PRIVILEGES ON contatos_db.*
TO 'contatos_user'@'localhost';
```

Saia do cliente MySQL:

```sql
EXIT;
```

Na raiz do projeto, execute o script de inicialização:

```bash
mysql -u contatos_user -p contatos_db < database/init.sql
```

Informe a senha configurada para o usuário.

Por fim, confirme que o arquivo `.env` contém as mesmas credenciais e inicie a aplicação:

```bash
npm start
```

> Caso utilize um servidor MySQL remoto ou um usuário já existente, adapte `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`. Não é necessário criar outro usuário se o usuário existente já tiver as permissões adequadas.

---

## Endpoints

**Base URL:** `http://localhost:3000`

| Método | Endpoint | Descrição | Sucesso |
|---|---|---|---|
| `POST` | `/contatos` | Cadastrar contato | `201 Created` |
| `GET` | `/contatos` | Listar contatos | `200 OK` |
| `PATCH` | `/contatos/:id` | Atualizar contato | `200 OK` |
| `DELETE` | `/contatos/:id` | Excluir contato | `204 No Content` |

### POST `/contatos`

Cadastra um novo contato.

**Requisição**

```json
{
  "nome": "João Pedro",
  "telefone": "21999999999"
}
```

**Resposta de sucesso — `201 Created`**

```json
{
  "id": 1,
  "nome": "João Pedro",
  "telefone": "21999999999"
}
```

### GET `/contatos`

Retorna a lista de contatos cadastrados.

**Resposta de sucesso — `200 OK`**

```json
[
  {
    "id": 1,
    "nome": "João Pedro",
    "telefone": "21999999999"
  },
  {
    "id": 2,
    "nome": "Maria Fernanda",
    "telefone": "21988888888"
  }
]
```

### PATCH `/contatos/:id`

Atualiza os dados de um contato existente.

O endpoint permite atualizar apenas os campos informados.

**Exemplo — `PATCH /contatos/1`**

```json
{
  "telefone": "21977777777"
}
```

**Resposta de sucesso — `200 OK`**

```json
{
  "id": 1,
  "nome": "João Pedro",
  "telefone": "21977777777"
}
```

### DELETE `/contatos/:id`

Remove um contato existente.

**Exemplo — `DELETE /contatos/1`**

**Resposta de sucesso — `204 No Content`**

A resposta não possui corpo.

### Tratamento de erros

A API utiliza códigos HTTP para indicar o resultado das operações.

| Código | Significado |
|---|---|
| `200` | Operação realizada com sucesso |
| `201` | Contato criado |
| `204` | Contato excluído |
| `400` | Dados inválidos |
| `404` | Contato não encontrado |
| `500` | Erro interno do servidor |

---

## Validações

### Nome

O campo `nome` deve:

- Ser uma string.
- Conter pelo menos duas palavras.
- Possuir no mínimo três letras em cada palavra.
- Conter apenas letras em cada palavra, incluindo caracteres acentuados.

**Exemplos válidos**

```text
João Pedro
Maria Fernanda
Carlos Eduardo Silva
```

**Exemplos inválidos**

```text
João
Ana de Souza
João123 Pedro
```

### Telefone

O campo `telefone` deve ser uma string não vazia.

### Identificador

Os identificadores utilizados nas rotas devem representar números inteiros positivos válidos.

---

## Testes automatizados

O projeto possui testes unitários e testes de integração utilizando o módulo nativo de testes do Node.js.

Os testes verificam:

- Validação de nomes.
- Validação de telefones.
- Validação de identificadores.
- Criação de contatos.
- Listagem de contatos.
- Atualização parcial.
- Exclusão de contatos.

### Executar todos os testes

```bash
./manage.sh test
```

O comando:

1. Prepara o ambiente de testes.
2. Inicializa um MySQL isolado.
3. Executa os testes unitários e de integração.
4. Exibe os resultados.
5. Remove os recursos temporários.

**O banco principal da aplicação não é utilizado pelos testes.**

### Executar apenas os testes unitários

Com Node.js e as dependências instaladas:

```bash
node --test tests/validators.test.js
```

---

## Estrutura do projeto

```text
backend-contatos/
├── database/
│   └── init.sql
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── contatoController.js
│   ├── repositories/
│   │   └── contatoRepository.js
│   ├── routes/
│   │   └── contatoRoutes.js
│   ├── services/
│   │   └── contatoService.js
│   ├── utils/
│   │   └── validators.js
│   └── app.js
├── tests/
│   ├── contatos.test.js
│   └── validators.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── compose.test.yaml
├── compose.yaml
├── Dockerfile
├── manage.sh
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

### Organização da aplicação

| Camada | Responsabilidade |
|---|---|
| Routes | Definição dos endpoints |
| Controllers | Tratamento das requisições e respostas HTTP |
| Services | Regras de negócio e validações |
| Repositories | Consultas e operações no banco |
| Config | Configuração da conexão MySQL |
| Utils | Funções auxiliares reutilizáveis |

Essa separação permite manter as responsabilidades organizadas e facilita a manutenção e os testes da aplicação.

---

**Projeto desenvolvido como parte de um desafio técnico de Backend.**