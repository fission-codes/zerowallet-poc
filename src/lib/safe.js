const axios = require('axios')
const fission = require('@fission-suite/client')
const keystore = require('./keystore')

const fissionAuth = {
  username: process.env.FISSION_USERNAME || "",
  password: process.env.FISSION_PASSWORD || ""
}
const fissionUrl = process.env.FISSION_URL || "https://runfission.com"

const api = process.env.API || 'http://localhost:8080'

const getContent = async (username) => {
  const resp = await axios.get(`${api}/safe-info?username=${username}`)
  const cid = resp.data.cid
  if(!cid){
    return ""
  }else {
    const cipherText = await fission.content(cid, fissionUrl)
    const content = keystore.decrypt(cipherText)
    return content
  }
}

const saveContent = async (username, content) => {
  const cipherText = keystore.encrypt(content)
  const cid = await fission.add(cipherText, fissionAuth, fissionUrl)
  await axios.post(`${api}/safe-cid`, { username, cid })
}

module.exports = {
  getContent,
  saveContent,
}
