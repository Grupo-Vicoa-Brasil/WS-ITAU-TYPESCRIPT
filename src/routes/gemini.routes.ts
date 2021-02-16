import open from 'opn'
import AppSuccess from '../errors/AppSuccess'

import express from 'express'

const app = express()

app.use(express.json())

export default function Gemini (req, res) {
  // Opens the url in the default browser
  open('45.179.89.8:3333/itau')
  open('45.179.89.8:3333/itau2')
  open('45.179.89.8:3333/itau4')
  open('45.179.89.8:3333/itau5')
  open('45.179.89.8:3333/itau6')
  open('45.179.89.8:3333/itau7')
  open('45.179.89.8:3333/itau8')
  open('45.179.89.8:3333/itau9')
  open('45.179.89.8:3333/itau10')

  console.log(new AppSuccess(' Todas as aplicações foram iniciadas com sucesso!'))
}
