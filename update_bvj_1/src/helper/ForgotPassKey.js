const crypto = require('crypto');
const CryptoJS = require('crypto-js');

const forgotPassKey = {
  encode: encode,
  decode: decode
}

function encode() {
  const buf = crypto.randomBytes(3);
  const remember_key = buf.toString('hex');
  const encodedWord = CryptoJS.enc.Utf8.parse(remember_key); // encodedWord Array object
  const encoded = CryptoJS.enc.Base64.stringify(encodedWord); // string: 'NzUzMjI1NDE='
  return encoded;
}
function decode(str) {
  const encodedWord = CryptoJS.enc.Base64.parse(str); // encodedWord via Base64.parse()
  const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify() '75322541'
  return decoded;
}

module.exports = forgotPassKey;