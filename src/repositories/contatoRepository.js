const pool = require('../config/database');

async function create({nome, telefone}) {

    const [result] = await pool.execute(
        'INSERT INTO contatos (nome, telefone) VALUES (?, ?)',
        [nome, telefone]
    );

    return {
        id: result.insertId,
        nome, 
        telefone
    };
    
}

async function findAll() {

    const [rows] = await pool.execute(
        'SELECT id, nome, telefone FROM contatos order by id'
    );

    return rows;
}

async function findById(id) {

    const [rows] = await pool.execute(
        'SELECT id, nome, telefone FROM contatos WHERE id=?',
    [id]
    );

    return rows[0] || null;
}

async function update(id, { nome, telefone }) {
    await pool.execute(
        'UPDATE contatos SET nome= ?, telefone = ? WHERE id = ?',
        [nome, telefone, id]
    );

    return findById(id);
}

async function remove(id) {
    const [result] = await pool.execute(
        'DELETE FROM contatos WHERE id = ?',
        [id]
    );

    return result.affectedRows > 0;
}

module.exports = { create, findAll, findById, update, remove };