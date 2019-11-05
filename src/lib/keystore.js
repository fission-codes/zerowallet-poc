const { sha256 } = require('../lib/utils')

function saveShard(shard) {
  window.localStorage.setItem("shard", shard)
}

function getShard() {
  return window.localStorage.getItem("shard")
}

function getPrivKey(password) {
  return secrets.combine([
    getShard(),
    `801${sha256(password)}`
  ])
}

module.exports = {
  saveShard,
  getShard,
  getPrivKey
}
