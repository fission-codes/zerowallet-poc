require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const { randomBytes32, ecExponent } = require('../lib/utils')
const { Client } = require('pg')

const tableName = process.env.TABLE_NAME || "zk_users"

const client = new Client()
client.connect()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const getUserByUsername = async (username) => {
  const usersRes = await client.query(`
    SELECT *
    FROM ${tableName}
    WHERE username = '${username}'
  `)
  if(usersRes.rowCount < 1){
    return null
  }
  return usersRes.rows[0]
}

app.post('/', async (req, res) => {
  const { username, alpha } = req.body
  if(!username || !alpha){
    return res.status(400).send("Please include username & alpha")
  }
  let digest

  const user = await getUserByUsername(username)

  if(!user){
    const random = randomBytes32()
    const key = crypto.createHash('sha256').update(random)
    digest = key.digest('hex')
    
    await client.query(`
      INSERT INTO ${tableName}(username, zk_key)
      VALUES ('${username}', '${digest}');
    `)
  }else{
    digest = user.zk_key
  }

  const beta = ecExponent(alpha, digest)
  res.status(200).send(beta[0])
}) 

app.get('/safe-info', async (req, res) => {
  const { username } = req.query
  if(!username){
    return res.status(400).send("Please include username")
  }
  const user = await getUserByUsername(username)
  if(!user){
    return res.status(404).send('User not found')
  }
  const { safe_cid, safe_key } = user
  res.status(200).send({ cid: safe_cid, key: safe_key })
})

app.post('/safe-key', async (req, res) => {
  const { username, key } = req.body
  if(!username || !key){
    return res.status(400).send("Please include username & key")
  }
  await client.query(`
    UPDATE ${tableName}
    SET safe_key = '${key}'
    WHERE username = '${username}'
  `)
  res.status(200).send()
})

app.post('/safe-cid', async (req, res) => {
  const { username, cid } = req.body
  console.log(req.query)
  if(!username || !cid){
    return res.status(400).send("Please include username & cid")
  }
  await client.query(`
    UPDATE ${tableName}
    SET safe_cid = '${cid}'
    WHERE username = '${username}'
  `)
  res.status(200).send()
})

const port = process.env.SERVER_PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}!`))
