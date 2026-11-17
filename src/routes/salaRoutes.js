const express = require('express');
const reservaController = require('../controllers/reservaController');
const salaController = require('../controllers/salaController');
const autenticar = require('../middlewares/authMiddleware');
const autorizar = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/', salaController.listar);
router.get('/:id', salaController.buscarPorId);
router.get('/:id/reservas', reservaController.listarPorSala);

router.post('/', autorizar('ADMIN'), salaController.criar);
router.put('/:id', autorizar('ADMIN'), salaController.atualizar);
router.delete('/:id', autorizar('ADMIN'), salaController.excluir);

module.exports = router;