const Notification = require('../models/Notification');

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(50);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get unread notifications count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      user: req.user.id, 
      read: false 
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification non trouvée' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Mark ALL as read
 * @route   PUT /api/notifications/mark-all-read
 * @access  Private
 */
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification non trouvée' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Non autorisé' });
    }

    await notification.deleteOne();

    res.json({ success: true, message: 'Notification supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
