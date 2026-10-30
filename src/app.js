const express = require('express');
const contatoRoutes = require('./routes/contatoRoutes');

const app = express();

app.use(express.json());

app.use('/contatos', contatoRoutes);

app.use((error, req, res, next) => {
    console.error(error);

    return res.status(error.statusCode || 500).json({
        mensagem: error.statusCode
            ? error.message
            : 'Erro interno do servidor.'
    });
});

module.exports = app;