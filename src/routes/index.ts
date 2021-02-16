import { Router } from 'express'

import itau1Router from './itau1.routes'
import itau2Router from './itau2.routes'
import itau3Router from './itau3.routes'
import itau4Router from './itau4.routes'
import itau5Router from './itau5.routes'
import itau6Router from './itau6.routes'
import itau7Router from './itau7.routes'
import itau8Router from './itau8.routes'
import itau9Router from './itau9.routes'
import itau10Router from './itau10.routes'

const routes = Router()

routes.use('/itau', itau1Router)
routes.use('/itau2', itau2Router)
routes.use('/itau3', itau3Router)
routes.use('/itau4', itau4Router)
routes.use('/itau5', itau5Router)
routes.use('/itau6', itau6Router)
routes.use('/itau7', itau7Router)
routes.use('/itau8', itau8Router)
routes.use('/itau9', itau9Router)
routes.use('/itau10', itau10Router)

export default routes
