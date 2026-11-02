const router = require('express').Router();

const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/productController');

// Consultar productos
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// Operaciones exclusivas del administrador
router.post('/', auth, authorize('admin'), ctrl.create);
router.put('/:id', auth, authorize('admin'), ctrl.update);
router.delete('/:id', auth, authorize('admin'), ctrl.remove);

module.exports = router;