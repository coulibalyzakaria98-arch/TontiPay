const express = require('express');
const {
  createPayment,
  validatePayment,
  rejectPayment,
  getMyPayments,
  getAllPayments,
  getTontinePayments,
} = require('../controllers/paymentController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // All payment routes are protected

router.post('/', createPayment);
router.get('/my-payments', getMyPayments);
router.get('/tontine/:tontineId', getTontinePayments);

// Tontine Creator routes (security handled in controller)
router.put('/:id/validate', validatePayment);
router.put('/:id/reject', rejectPayment);

// Super Admin only routes
router.get('/', authorize('admin'), getAllPayments);

module.exports = router;
