const contatoRepository = require('../repositories/contatoRepository');

const {
    isValidName,
    isValidId,
    isValidPhone
} = require('../utils/validators');


async function create( {nome, telefone }) {
    if (!isValidName(nome)) {
        const error = new Error(
            'O nome deve conter pelo menos duas palavras, cada uma com no mínimo três letras.'
        );

        error.statusCode = 400;
        throw error;
    }

    if (!isValidPhone(telefone)) {
        const error = new Error('O telefone é obrigatório.');
        error.statusCode = 400;
        throw error;
    }

    return contatoRepository.create({
        nome: nome.trim().replace(/\s+/g, ' '),
        telefone: telefone.trim()
    });
}

async function findAll() {
    return contatoRepository.findAll();
}

async function update(id, data) {
    if (!isValidId(id)) {
        const error = new Error('ID inválido.');
        error.statusCode = 400;
        throw error;
    }

    const contato = await contatoRepository.findById(id);

    if (!contato) {
        const error = new Error('Contato não encontrado.');
        error.statusCode = 404;
        throw error;
    }

    const nome = data.nome === undefined ? contato.nome : data.nome;
    const telefone = data.telefone === undefined ? contato.telefone : data.telefone;

    if (!isValidName(nome)) {
        const error = new Error(
            'O nome deve conter pelo menos duas palavras, cada uma com no mínimo três letras.'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!isValidPhone(telefone)) {
        const error = new Error('O telefone é obrigatório.');
        error.statusCode = 400;
        throw error;
    }

    return contatoRepository.update(id, {
        nome: nome.trim().replace(/\s+/g, ' '),
        telefone: telefone.trim()
    });
}

async function remove(id) {
    if (!isValidId(id)) {
        const error = new Error('ID inválido.');
        error.statusCode = 400;
        throw error;
    }

    const removed = await contatoRepository.remove(id);

    if (!removed) {
        const error = new Error('Contato não encontrado.');
        error.statusCode = 404;
        throw error;
    }
}

module.exports = { create, findAll, update, remove };