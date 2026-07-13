const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isVerified: user.isVerified
    }
  });
};

// ✅ NO next HERE
const signup = async (req, res) => {
  console.log('📝 Signup request received:', req.body);
  
  try {
    const { username, email, mobile, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { mobile }]
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email) message = 'Email already registered';
      if (existingUser.username === username) message = 'Username already taken';
      if (existingUser.mobile === mobile) message = 'Mobile number already registered';
      
      return res.status(400).json({
        success: false,
        message
      });
    }

    const user = await User.create({
      username,
      email,
      mobile,
      password
    });

    console.log('✅ User created successfully:', user._id);
    sendTokenResponse(user, 201, res);
    
  } catch (error) {
    console.error('❌ Signup Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ NO next HERE
const login = async (req, res) => {
  console.log('📝 Login request received:', req.body.email);
  
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(403).json({
        success: false,
        message: `Account is locked. Please try again after ${remainingTime} minutes`
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      await user.incrementLoginAttempts();
      const remainingAttempts = 5 - (user.loginAttempts || 0);
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${remainingAttempts} attempts remaining`
      });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    console.log('✅ Login successful:', email);
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ NO next HERE
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ GetMe Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

// ✅ NO next HERE
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('❌ ChangePassword Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};

// ✅ NO next HERE
const updateProfile = async (req, res) => {
  try {
    const { username, email, mobile } = req.body;
    
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user.id } },
        { $or: [{ email }, { username }, { mobile }] }
      ]
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email) message = 'Email already registered';
      if (existingUser.username === username) message = 'Username already taken';
      if (existingUser.mobile === mobile) message = 'Mobile number already registered';
      
      return res.status(400).json({
        success: false,
        message
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, mobile },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('❌ UpdateProfile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// ✅ NO next HERE
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('❌ Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  changePassword,
  updateProfile,
  logout
};