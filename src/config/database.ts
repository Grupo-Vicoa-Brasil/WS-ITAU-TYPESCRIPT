require('dotenv').config()

export const config = {
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USUARIO,
  password: process.env.PASS,
  port: process.env.PORT_DB
}

module.exports = config
