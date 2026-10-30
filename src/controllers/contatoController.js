const contatoService = require('../services/contatoService');

async function create(req, res) {
    const contato = await contatoService.create(req.body);

    return res.status(201).json(contato);
}

async function findAll(req, res) {
    const contatos = await contatoService.findAll();

    return res.status(200).json(contatos)
}

async function update(req, res) {
    const contato = await contatoService.update(req.params.id, req.body);

    return res.status(200).json(contato);
}

async function remove(req, res) {
    await contatoService.remove(req.params.id);

    return res.sendStatus(204);
}

module.exports = { create, findAll, update, remove };