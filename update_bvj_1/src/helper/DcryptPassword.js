const bcrypt = require('bcryptjs');
const dcryptPass = (password) => {
  const hashedPass = bcrypt.hashSync(password, 12);
  return hashedPass;
}

module.exports = dcryptPass;