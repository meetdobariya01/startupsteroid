// Additional validation utilities
const validator = {
  isStrongPassword: (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  },
  
  isEmail: (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },
  
  isMobile: (mobile) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(mobile);
  },
  
  isUsername: (username) => {
    const regex = /^[a-zA-Z0-9_]{3,30}$/;
    return regex.test(username);
  }
};

module.exports = validator;