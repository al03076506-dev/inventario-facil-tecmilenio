const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/productController');
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);
module.exports = router;
