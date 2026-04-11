const express = require('express');
const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  getAllTontines,
  deleteTontine,
  getSystemStats,
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes here are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/tontines', getAllTontines);
router.delete('/tontines/:id', deleteTontine);
router.get('/stats', getSystemStats);

module.exports = router;
