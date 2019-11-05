import crypto from 'crypto'
import axios from 'axios'
import BigInteger from 'bigi'
import ecurve from 'ecurve'
import keystore from './keystore'
const ecparams = ecurve.getCurveByName('secp256k1',"","")

export async function createShard(username, password1, password2){
    const alpha = alphaFromPass(password2)

    const hashpw1 = sha256(password1)
    const hashpw2 = sha256(password2)

    const resp = await axios.post('http://localhost:8080', { username, alpha: alpha[0] })
    const inv = ECCLib.ECInverse(random)
    const beta = ECCLib.ECModExponent(resp.data, inv)
    const rw = sha256(hashpw2.concat(beta))

    const shares = [`801${hashpw1}`,`802${rw}`];
    const privshare = secrets.newShare("03",shares);
    keystore.saveShard(privshare)
    return privshare
}

export function alphaFromPass(pw) {
  const hashpw = sha256(pw)
  const point = hashToPoint(hashpw)
  const random = crypto.randomBytes(32).toString('hex')
  const alpha = ecModExponent(point[0], random)
  return alpha
}

export function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

export function ecInverse(key) {
  var privateKey = new Buffer(key, 'hex')
  var privst1 = BigInteger.fromBuffer(privateKey);
  var privateKeyInv = privst1.modInverse(ecparams.n);

  return privateKeyInv;
}

export function hashToPoint(gx) {
  var xpt = new Buffer(String(gx), 'hex')
  var pt = ecparams.pointFromX(true,BigInteger.fromBuffer(xpt));

  return [String(pt.affineX), String(pt.affineY)];
}

export function ecExponent(gx, expo) {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}

export function ecModExponent(gx, expo) {
  var exponent = BigInteger(String(expo));
  var xpt = BigInteger(String(gx));
  var pt = ecparams.pointFromX(true,xpt);
  var curvePt = pt.multiply(exponent);

  return [String(curvePt.affineX), String(curvePt.affineY)];
}


export default {
  createShard,
  alphaFromPass,
  sha256,
  ecInverse,
  hashToPoint,
  ecExponent,
  ecModExponent
}
