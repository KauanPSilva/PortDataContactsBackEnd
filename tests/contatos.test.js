const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '0.0.0.0', resolve);
  });

  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  const database = require('../src/config/database');
  await database.end();
});

test('POST /contatos deve criar um contato', async () => {
  const response = await fetch(`${baseUrl}/contatos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: 'João Pedro',
      telefone: '21999999999',
    }),
  });

  assert.equal(response.status, 201);

  const contato = await response.json();

  assert.equal(contato.nome, 'João Pedro');
  assert.equal(contato.telefone, '21999999999');
  assert.ok(contato.id);
});

test('GET /contatos deve listar os contatos', async () => {
  const response = await fetch(`${baseUrl}/contatos`);

  assert.equal(response.status, 200);

  const contatos = await response.json();

  assert.ok(Array.isArray(contatos));
});

test('PATCH /contatos/:id deve atualizar um contato', async () => {
  const createResponse = await fetch(`${baseUrl}/contatos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: 'Carlos Eduardo',
      telefone: '21988888888',
    }),
  });

  assert.equal(createResponse.status, 201);

  const contato = await createResponse.json();

  const response = await fetch(`${baseUrl}/contatos/${contato.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      telefone: '21977777777',
    }),
  });

  assert.equal(response.status, 200);

  const atualizado = await response.json();

  assert.equal(atualizado.id, contato.id);
  assert.equal(atualizado.nome, 'Carlos Eduardo');
  assert.equal(atualizado.telefone, '21977777777');
});

test('DELETE /contatos/:id deve excluir um contato', async () => {
  const createResponse = await fetch(`${baseUrl}/contatos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nome: 'Maria Fernanda',
      telefone: '21966666666',
    }),
  });

  assert.equal(createResponse.status, 201);

  const contato = await createResponse.json();

  const response = await fetch(`${baseUrl}/contatos/${contato.id}`, {
    method: 'DELETE',
  });

  assert.equal(response.status, 204);
  assert.equal(await response.text(), '');

  const listResponse = await fetch(`${baseUrl}/contatos`);

  assert.equal(listResponse.status, 200);

  const contatos = await listResponse.json();

  assert.equal(
    contatos.some((item) => item.id === contato.id),
    false
  );
});