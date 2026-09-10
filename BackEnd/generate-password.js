// generate-password.js
const bcrypt = require('bcrypt');

const password = 'Admin@123'; // Change this to your desired password
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  console.log('Password:', password);
  console.log('Hashed password:', hash);
  console.log('\nCopy this hash for MongoDB:');
  console.log(hash);
});