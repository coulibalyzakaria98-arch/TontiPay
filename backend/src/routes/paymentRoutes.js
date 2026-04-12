const express = require('express');
const router = express.Router();
const {
  createPayment,
  validatePayment,
  getReceipt,
  getMyHistory
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', createPayment);
router.get('/my-history', getMyHistory);
router.get('/:id/receipt', getReceipt);
router.patch('/:id/validate', validatePayment);

module.exports = router;
