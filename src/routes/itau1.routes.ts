import express, { Request, Response } from 'express'
import axios from 'axios'
import AppError from '../errors/AppError'
import AppUpdated from '../errors/AppUpdated'
import AppSuccess from '../errors/AppSuccess'
import xml2js from 'xml2js'
import mysql from 'mysql'
import cron from 'node-cron'
const app = express()
const config = require('../config/database')
require('dotenv').config()
const connection = mysql.createConnection(config)

export default function ITAU1 (req, res) {
  app.get('/cpfs', (req: Request, res: Response) => {
    connection.query('SELECT distinct(cpf), entidade, estado FROM ws_itauInput where estado is null limit 1', function (err: Error, result: Response, fields) {
      if (err) throw new AppError('Falha ao consultar cpfs', 500)
      else {
        res.json(`Resultado: ${[result[0]]}`)
        // console.log('Rebolo de dados 1')
      }
    })
  })

  const trabalharCpf = async (cpf: string, entidade: string) => {
    console.log('⌛ Consultando CPF: ', cpf, entidade)
    const { data } = await axios.post(`http://refin.datafast.com.br/itaubmg?usuario=FINANSERV&senha=Fw23asWs2efyf3&usuarioBanco=${process.env.login_itauN}&senhaBanco=${process.env.senha_itauN}&cpf=${cpf}&convenioRefin=${entidade}&dadosCadastrais=SIM`)
    console.log(`⌛ CPF ${cpf} consultado`, 'Entidade: ', entidade)
    const parser = new xml2js.Parser({
      explicitArray: false,
      trim: true
    })

    const resultado = await parser.parseStringPromise(data)
    // console.log(resultado.RESULTADO)

    if (resultado.RESULTADO.ERRO === 'NAO') {
      const query = `UPDATE ws_itauInput set estado = '1' where estado IS NULL and cpf = '${cpf}' and entidade = '${entidade}'  `
      // eslint-disable-next-line node/handle-callback-err
      connection.query(query, function (err: Error, result, fields) {
        console.log('ITAU 1 - CPF Consultado Atualizado!')
        console.log(new AppUpdated('🌟 ITAU 1 - CPF Constultado Atualizado!'))
      })
      // console.log(resultado.RESULTADO.OK)
      console.log(new AppSuccess(`✅ ${resultado.RESULTADO.OK}`))
    }

    if (resultado.RESULTADO.OK === 'SIM') {
      let iterador = 0
      // eslint-disable-next-line no-unmodified-loop-condition
      while (resultado.RESULTADO.REFINANCIAMENTOS.CONTRATO[iterador] !== '' || undefined) {
        if (resultado.RESULTADO.TIPO_MENSAGEM !== 'SEM_CONTRATO') {
          const result = resultado.RESULTADO.REFINANCIAMENTOS.CONTRATO[iterador]

          const sql = `INSERT INTO ws_itauOut 
            (cpf, id_contrato, matricula, numero_contrato, 
            data_contrato, valor_contrato, dt_primeiro_venc, 
            dt_prox_venc, parcelas_contrato, parcelas_vencidas, 
            parcelas_aberto, parcelas_refin, valor_parcela, 
            percent_pago, saldo_refin, taxa_contrato, observacao)
            VALUES
            ('${cpf}',  'ID - ROBO 0O', '${result.MATRICULA}', '${result.NUMERO_CONTRATO}', 
            '${result.DATA_CONTRATO}', '${result.VALOR_CONTRATO}', 
            '${result.DATA_PRIMEIRO_VENCIMENTO}', '${result.DATA_PROXIMO_VENCIMENTO}', 
            '${result.PARCELAS_CONTRATO}', '${result.PARCELAS_VENCIDAS}', 
            '${result.PARCELAS_EM_ABERTO}', '${result.PARCELAS_REFIN}', 
            '${result.VALOR_PARCELA}', '${result.PERCENTUAL_PAGO}', 
            '${result.SALDO_REFIN}', '${result.TAXA_CONTRATO}', '${result.OBSERVACAO}' )`
          // eslint-disable-next-line node/handle-callback-err
          connection.query(sql, function (err: Error, result: Response) {
            // console.log("Registro Inserido com Sucesso");
            // console.log(result)
            console.log(new AppSuccess(`✅ ${cpf}`))
            if (!sql) {
              throw new AppError('Erro na string de insert SQL', 500)
            }
          })
          iterador = iterador + 1
          if (resultado.RESULTADO.REFINANCIAMENTOS.CONTRATO[iterador] === undefined) {
            break
          }
        }
      }
    } else {
      console.log(resultado.RESULTADO.MENSAGEM)
    }
  }

  let isRunning = false

  cron.schedule('*/10 * * * * *', async () => {
    if (isRunning) return // ignora a execução

    isRunning = true // lock
    console.log('⌛ Consultando CPFS...')

    try {
      const { data } = await axios.get('http://localhost:3333/cpfs')
      for (const { cpf, entidade } of data) await trabalharCpf(cpf, entidade)
    } catch (err) {
      // console.error(err)
      throw new AppError('🔞 Não possui CPFS válidos para consulta na base.', 400)
    } finally {
      isRunning = false // libera o lock
    }
  })

  return res.send({ message: 'Server 1 - ITAU', status: 'Online', file: 'itau1.routes.ts' })
}

// 1 login quebra captcha
