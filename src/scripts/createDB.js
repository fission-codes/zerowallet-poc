require('dotenv').config()
const { Client } = require('pg')

const migrate = async () => {
  const client = new Client()
  await client.connect()

  const res = await client.query(`
    CREATE TABLE users (
      username text PRIMARY KEY,
      zk_key text NOT NULL,
      safe_cid text,
      safe_key text
    );
  `)
  console.log(res)
}

migrate()
