const RSA = require('./tool/RSA');
var m = '82a0258506d06ff2c898d2984e9bcc20e8614156c53409533fff3fcf586dc3d2dbc6c77e90cf43061edef6a1b11b5be8a0343613922c7083496d35fda79b3e3bb179e9c6f5a254f9658f97078c8e85f0fc259d60aec75e4490bf06de84312233d646273ec61ba419f0259a94aecdcea3970ca4411ff221b4b55192bcaf77426b',
    e = '010001';
    RSA.setMaxDigits(129);
var key = new RSA.RSAKeyPair(e, "", m);
var fake = RSA.encrypt(key,'abc');
console.log(fake)