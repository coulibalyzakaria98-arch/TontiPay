const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;

    // Create fake user for testing without DB
    const user = {
      _id: new mongoose.Types.ObjectId(),
      nom,
      prenom,
      email,
      telephone,
      role: 'user'
    };

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir un email et un mot de passe',
      });
    }

    // Check for user (fake for testing without DB)
    let user = null;
    if (email === 'test@test.com' && password === 'password') {
      user = {
        _id: new mongoose.Types.ObjectId(),
        nom: 'Test',
        prenom: 'User',
        email: 'test@test.com',
        role: 'user'
      };
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    },
  });
};
