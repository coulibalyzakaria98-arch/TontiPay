const express = require('express');
const router = express.Router();
const {
  createPayment,
  validatePayment,
  getTontinePayments,
  getMyPayments,
  getReceipt
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createPayment);
router.get('/my-payments', getMyPayments);
router.get('/tontine/:tontineId', getTontinePayments);
router.get('/:id/receipt', getReceipt);
router.patch('/:id/validate', validatePayment);

module.exports = router;
