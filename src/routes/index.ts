import { Router } from 'express'

import itau1Router from './itau1.routes'

const routes = Router()

routes.use('/itau', itau1Router)

export default routes
