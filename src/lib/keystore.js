import { sha256 } from '../lib/utils'

export function saveShard(shard) {
  window.localStorage.setItem("shard", shard)
}

export function getShard() {
  return window.localStorage.getItem("shard")
}

export function getPrivKey(password) {
  return secrets.combine([
    getShard(),
    `801${sha256(password)}`
  ])
}

export default {
  saveShard,
  getShard,
  getPrivKey
}
