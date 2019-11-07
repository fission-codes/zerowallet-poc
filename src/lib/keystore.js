const axios = require('axios')
const crypto = require('crypto')
const { sha256, randomBytes32, ecInverse, hashToPoint, ecModExponent } = require('./utils')
const EC = require('elliptic').ec

const api = process.env.API || 'http://localhost:8080'
const algorithm = process.env.SYMMETRIC_ALGO || 'aes256'
const curve = process.env.CURVE || 'secp256k1'
const ec = new EC(curve)

let keypair = null
let cipherKey = null

const unlock = async (username, password) => {
  const secret = secrets.combine([
    getShard(),
    `801${sha256(password)}`
  ])
  keypair = ec.keyFromPrivate(secret)
  cipherKey = await retrieveCipherKey(username)
}

const retrieveCipherKey = async (username) => {
  let safe = {}
  try {
    const resp = await axios.get(`${api}/safe-info?username=${username}`)
    safe = resp.data
  }catch(err){
    console.log("Could not find user")
  }
  if(safe.key){
    return decrypt(safe.key, keypair.getPrivate().toString('hex'))
  }else{
    const newCipher = sha256(randomBytes32())
    const encrypted = encrypt(newCipher, keypair.getPrivate().toString('hex'))
    await axios.post(`${api}/safe-key`, { username, key: encrypted })
    return newCipher
  }
}

const encrypt = (text, key=cipherKey) => {
  const cipher = crypto.createCipher(algorithm, key)
  let ciphered = cipher.update(text, 'utf8', 'hex')
  ciphered += cipher.final('hex')
  return ciphered
}

const decrypt = (ciphered, key=cipherKey) => {
  const decipher = crypto.createDecipher(algorithm, key)
  let text = decipher.update(ciphered, 'hex', 'utf8')
  text += decipher.final('utf8')
  return text
}

const getShard = () => {
  return window.localStorage.getItem("shard")
}

const hasShard = () => {
  const shard = getShard()
  return shard && shard.length > 0
}

const saveShard = (shard) => {
  window.localStorage.setItem("shard", shard)
}

const createShard = async (username, password1, password2) => {
  const hashpw1 = sha256(password1)
  const hashpw2 = sha256(password2)
  const random = randomBytes32()

  const point = hashToPoint(hashpw2)
  const alpha = ecModExponent(point[0], random)

  const resp = await axios.post(api, { username, alpha: String(alpha[0]) }, { transformResponse: [] })
  const inv = ecInverse(random)
  const beta = ecModExponent(resp.data, inv)
  const rw = sha256(hashpw2.concat(beta[0]))

  const shares = [`801${hashpw1}`,`802${rw}`];
  const privshare = secrets.newShare("03",shares);
  saveShard(privshare)
}

module.exports = {
  unlock,
  encrypt,
  decrypt,
  hasShard,
  saveShard,
  createShard,
}
