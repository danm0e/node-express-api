import { Router } from 'express'
import { z } from 'zod'
import { validateBody } from '../../middleware/index.ts'

const habitsSchema = z.object({ name: z.string() })

export const habitsRouter = Router()

habitsRouter.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

habitsRouter.get('/:id', (req, res) => {
  res.json({ message: 'got one habit' })
})

habitsRouter.post('/', validateBody(habitsSchema), (req, res) => {
  res.json({ message: 'habit created' })
})

habitsRouter.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

habitsRouter.post('/id/complete', (req, res) => {
  res.json({ message: 'habit completed' })
})
