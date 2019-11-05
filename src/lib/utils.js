const crypto = require('crypto')
const BigInteger = require('bigi')
const ecurve = require('ecurve')
const ecparams = ecurve.getCurveByName('secp256k1',"","")

const sha256 = (str) => {
  return crypto.createHash('sha256').update(str).digest('hex')
}

const randomBytes32 = () => {
  return crypto.randomBytes(32).toString('hex')
}

const ecInverse = (key) => {
  var privateKey = BigInteger(String(key))
  var privateKeyInv = privateKey.modInverse(ecparams.n);

  return privateKeyInv;
}

const hashToPoint = (gx) => {
  var pt = ecparams.pointFromX(true,BigInteger.fromHex(gx));

  return [String(pt.affineX), String(pt.affineY)];
}

const ecExponent = (gx, expo) => {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

exports.ECExponent = function (gx, expo){

  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

const ecModExponent = (gx, expo) => {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

module.exports = {
  sha256,
  randomBytes32,
  ecInverse,
  hashToPoint,
  ecExponent,
  ecModExponent
}
