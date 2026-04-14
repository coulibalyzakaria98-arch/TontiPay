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
router.get('/', authorize('admin'), getAllPayments); // Admin global
router.get('/my', getMyHistory); // Historique personnel (NVP compliant)
router.get('/tontine/:tontineId', getTontinePayments); // Liste pour l'admin de la tontine
router.get('/:id/receipt', getReceipt);
router.patch('/:id/validate', validatePayment);

module.exports = router;
