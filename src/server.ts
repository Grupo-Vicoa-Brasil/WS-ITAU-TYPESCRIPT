import express, { Request, Response, NextFunction } from 'express'
import routes from './routes/index'
const mysql = require('mysql')
const config = require('./config/database')
const app = express()
app.use(routes)
app.use(express.json())

const connection = mysql.createConnection(config)

if (connection) {
  console.log('✨ Conexão MySql estabelecida!')
} else {
  console.log('❌ Conexão MySql não estabelecida!')
}

function logRequests (req: Request, res: Response, next: NextFunction) {
  const { method, url } = req
  const logLabel = `[${method.toUpperCase()}] ${url}`
  console.log(logLabel)
  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}
app.use(logRequests)

app.get('/', (req, res) => {
  return res.json({ message: 'Web Service Itaú', status: 'Online', file: 'server.ts' })
})

// app.get('/cpfs', (req, res) => {
//   connection.query('SELECT distinct(cpf), entidade, estado FROM ws_itauInput where estado is null limit 1', function (err, result, fields) {
//     if (err) throw err
//     res.json(result)
//   })
// })

app.listen(3333, () => console.log('🔥 Webservice iniciado!'))
