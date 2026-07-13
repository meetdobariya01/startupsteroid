const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
  
  } catch (error) {
 
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;