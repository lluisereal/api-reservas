const express = require('express');
const reservaController = require('../controllers/reservaController');
const autenticar = require('../middlewares/authMiddleware');
const autorizar = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(autenticar);

router.post('/', reservaController.criar);
router.get('/minhas', reservaController.listarMinhas);
router.get('/', autorizar('ADMIN'), reservaController.listarTodas);
router.get('/:id', reservaController.buscarPorId);
router.put('/:id', reservaController.atualizar);
router.delete('/:id', reservaController.excluir);

module.exports = router;