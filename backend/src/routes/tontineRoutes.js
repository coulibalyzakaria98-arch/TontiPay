const express = require('express');
const {
  createTontine,
  joinTontine,
  getMyTontines,
  getTontine,
} = require('../controllers/tontineController');

const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All routes are protected

router.route('/').post(createTontine);
router.route('/join').post(joinTontine);
router.route('/my-tontines').get(getMyTontines);
router.route('/:id').get(getTontine);

module.exports = router;
