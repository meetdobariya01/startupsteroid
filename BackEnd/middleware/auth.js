const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

   

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
    } else {
     
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message);
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
  
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }


    req.user = user;
    
    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {

    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    
   
    next();
  };
};

module.exports = { authMiddleware, authorize };