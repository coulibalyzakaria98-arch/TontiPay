const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Zod schema for profile update
const updateSchema = z.object({
  nom: z.string().min(2).optional(),
  prenom: z.string().min(2).optional(),
  email: z.string().email("Email invalide").optional(),
  telephone: z.string().min(8, "Numéro de téléphone trop court").optional(),
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = async (req, res) => {
  try {
    const validatedData = updateSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(req.user.id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: user });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check current password
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, error: 'Mot de passe actuel incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
