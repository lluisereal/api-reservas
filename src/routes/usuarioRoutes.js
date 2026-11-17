const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const autenticar = require('../middlewares/authMiddleware');
const autorizar = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(autenticar, autorizar('ADMIN'));

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.get('/:id/reservas', usuarioController.listarReservas);

module.exports = router;