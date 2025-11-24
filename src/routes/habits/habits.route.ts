import { Router } from 'express'
import { z } from 'zod'
import {
  authenticateToken,
  validateBody,
  validateParams,
} from '../../middleware/index.ts'

const createHabitsSchema = z.object({ name: z.string() })
const completeHabitsSchema = z.object({ id: z.string().max(3) })

export const habitsRouter = Router()

habitsRouter.use(authenticateToken) // use authentication middleware for all habit routes

habitsRouter.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

habitsRouter.get('/:id', (req, res) => {
  res.json({ message: 'got one habit' })
})

habitsRouter.post('/', validateBody(createHabitsSchema), (req, res) => {
  res.json({ message: 'habit created' })
})

habitsRouter.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

habitsRouter.post(
  '/:id/complete',
  validateParams(completeHabitsSchema),
  validateBody(createHabitsSchema),
  (req, res) => {
    res.json({ message: 'habit completed' })
  }
)
