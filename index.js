require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const ECC = require('./ECCLib')
const { Client } = require('pg')

const client = new Client()
client.connect()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/', async (req, res) => {
  const { userID, alpha } = req.body
  let digest

  const usersRes = await client.query(`
    SELECT *
    FROM zk_keys
    WHERE user_id = ${userID}
  `)

  if(usersRes.rowCount < 1){
    const key = crypto.createHash('sha256').update("poasidfuapsodifu")
    digest = key.digest('hex')
    const query = `
      INSERT INTO zk_keys(user_id, zk_key)
      VALUES (${userID}, '${digest}');
    `
    await client.query(query)
  }else{
    digest = usersRes.rows[0].zk_key
  }

  const beta = ECC.ECExponent(alpha, digest)
  res.send(beta[0]).status(200)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}!`))
