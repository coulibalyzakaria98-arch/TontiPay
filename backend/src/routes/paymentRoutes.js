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

// Admin only routes
router.get('/', authorize('admin'), getAllPayments);
router.put('/:id/validate', authorize('admin'), validatePayment);
router.put('/:id/reject', authorize('admin'), rejectPayment);

module.exports = router;
