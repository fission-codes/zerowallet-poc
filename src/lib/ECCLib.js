var BigInteger = require('bigi')
var ecurve = require('ecurve')
var ecparams = ecurve.getCurveByName('secp256k1',"","")

exports.ECInverse = function (key) {
  var privateKey = new Buffer(key, 'hex')
  var privst1 = BigInteger.fromBuffer(privateKey);
  var privateKeyInv = privst1.modInverse(ecparams.n);

  return privateKeyInv;
}

exports.HashtoPoint = function (gx){
  var xpt = new Buffer(String(gx), 'hex')
  var pt = ecparams.pointFromX(true,BigInteger.fromBuffer(xpt));

  return [String(pt.affineX), String(pt.affineY)];
}

exports.ECExponent = function (gx, expo){
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

exports.ECModExponent = function (gx, expo){
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}
