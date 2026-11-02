const router = require('express').Router();

const ctrl = require('../controllers/currencyController');

router.get('/convert', ctrl.convert);

module.exports = router;
