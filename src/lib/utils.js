const crypto = require('crypto')
const axios = require('axios')
const BigInteger = require('bigi')
const ecurve = require('ecurve')
const keystore = require('./keystore')
const ecparams = ecurve.getCurveByName('secp256k1',"","")

async function createShard(username, password1, password2){
    const random = crypto.randomBytes(32).toString('hex')
    const alpha = alphaFromPass(password2, random)

    const hashpw1 = sha256(password1)
    const hashpw2 = sha256(password2)

    const resp = await axios.post('http://localhost:8080', { username, alpha })
    const inv = ecInverse(random)
    const beta = ecModExponent(resp.data, inv)
    const rw = sha256(hashpw2.concat(beta))

    const shares = [`801${hashpw1}`,`802${rw}`];
    const privshare = secrets.newShare("03",shares);
    keystore.saveShard(privshare)
    return privshare
}

function alphaFromPass(pw, random) {
  const hashpw = sha256(pw)
  const point = hashToPoint(hashpw)
  const alpha = ecModExponent(point[0], random)
  return alpha[0]
}

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

function ecInverse(key) {
  var privateKey = new Buffer(key, 'hex')
  var privst1 = BigInteger.fromBuffer(privateKey);
  var privateKeyInv = privst1.modInverse(ecparams.n);

  return privateKeyInv;
}

function hashToPoint(gx) {
  var xpt = new Buffer(String(gx), 'hex')
  var pt = ecparams.pointFromX(true,BigInteger.fromBuffer(xpt));

  return [String(pt.affineX), String(pt.affineY)];
}

function ecExponent(gx, expo) {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

function ecModExponent(gx, expo) {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}


module.exports = {
  createShard,
  alphaFromPass,
  sha256,
  ecInverse,
  hashToPoint,
  ecExponent,
  ecModExponent
}
