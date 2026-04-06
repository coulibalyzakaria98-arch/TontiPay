const express = require('express');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('admin')); // Statistics are for admins only

router.get('/', getStats);

module.exports = router;
