
var rsa = require("./RSA");
module.exports =  function (exponent, modulus, content) {
    rsa.setMaxDigits(129);
    var key = new rsa.RSAKeyPair(exponent, "", modulus);
    return rsa.encrypt(key, content);
};
