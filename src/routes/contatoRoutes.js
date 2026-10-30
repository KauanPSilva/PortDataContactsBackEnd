const express = require('express');
const contatoController = require('../controllers/contatoController');

const router = express.Router();

router.post('/', contatoController.create);
router.get('/', contatoController.findAll);
router.patch('/:id', contatoController.update);
router.delete('/:id', contatoController.remove);

module.exports = router;