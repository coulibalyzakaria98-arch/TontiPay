const statsService = require('../services/statsService');

/**
 * @desc    Get user's global stats (Dashboard)
 * @route   GET /api/stats/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await statsService.getUserGlobalStats(req.user.id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get specific tontine stats (Admin)
 * @route   GET /api/stats/tontine/:tontineId
 * @access  Private
 */
exports.getTontineStats = async (req, res) => {
  try {
    const stats = await statsService.getTontineAdminStats(req.params.tontineId);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
