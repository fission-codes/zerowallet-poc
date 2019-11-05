require('dotenv').config()
const { Client } = require('pg')

const migrate = async () => {
  const client = new Client()
  await client.connect()

  const res = await client.query(`
    CREATE TABLE zk_keys (
      username text PRIMARY KEY,
      zk_key text NOT NULL
    );
  `)
  console.log(res)
}

migrate()
