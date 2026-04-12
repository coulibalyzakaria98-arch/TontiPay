const express = require('express');
const router = express.Router();
const { getDashboardStats, getTontineStats } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/tontine/:tontineId', getTontineStats);

module.exports = router;
