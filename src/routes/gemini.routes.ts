import open from 'opn'
import AppSuccess from '../errors/AppSuccess'

import express from 'express'

const app = express()

app.use(express.json())

export default function Gemini (req, res) {
  (async (req, res) => {
    // Opens the url in the default browser
    await open('/itau')
    await open('/itau2')
    await open('/itau4')
    await open('/itau5')
    await open('/itau6')
    await open('/itau7')
    await open('/itau8')
    await open('/itau9')
    await open('/itau10')

    console.log(new AppSuccess(' Todas as aplicações foram iniciadas com sucesso!'))
  })()
}
