const axios = require('axios')
const { sha256, randomBytes32, ecInverse, hashToPoint, ecModExponent } = require('./utils')

const saveShard = (shard) => {
  window.localStorage.setItem("shard", shard)
}

const getShard = () => {
  return window.localStorage.getItem("shard")
}

const getPrivKey = (password) => {
  return secrets.combine([
    getShard(),
    `801${sha256(password)}`
  ])
}

const createShard = async (username, password1, password2) => {
  const hashpw1 = sha256(password1)
  const hashpw2 = sha256(password2)
  const random = randomBytes32()

  const point = hashToPoint(hashpw2)
  const alpha = ecModExponent(point[0], random)

  const resp = await axios.post('http://localhost:8080', { username, alpha: String(alpha[0]) }, { transformResponse: [] })
  const inv = ecInverse(random)
  const beta = ecModExponent(resp.data, inv)
  const rw = sha256(hashpw2.concat(beta[0]))

  const shares = [`801${hashpw1}`,`802${rw}`];
  const privshare = secrets.newShare("03",shares);
  const secret = secrets.combine(shares)
  console.log("secret: ", secret)
  return privshare
}

module.exports = {
  saveShard,
  getShard,
  getPrivKey,
  createShard,
}
