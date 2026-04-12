const express = require('express');
const router = express.Router();
const {
  createPayment,
  validatePayment,
  getReceipt,
  getMyHistory,
  getTontinePayments,
  getAllPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createPayment);
router.get('/', authorize('admin'), getAllPayments);
router.get('/my-history', getMyHistory);
router.get('/tontine/:tontineId', getTontinePayments);
router.get('/:id/receipt', getReceipt);
router.patch('/:id/validate', validatePayment);

module.exports = router;
