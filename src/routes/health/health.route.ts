import { Router } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Node/Express API',
  })
})
