import { Router } from 'express'
import { z } from 'zod'
import {
  authenticateToken,
  validateBody,
  validateParams,
} from '../../middleware/index.ts'
import {
  createHabit,
  deleteHabit,
  getHabit,
  getHabits,
  updateHabit,
} from '../../controllers/habits.controller.ts'

const createHabitsSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
})
const completeHabitsSchema = z.object({ id: z.string().max(3) })

export const habitsRouter = Router()

habitsRouter.use(authenticateToken) // use authentication middleware for all habit routes

habitsRouter.post('/', validateBody(createHabitsSchema), createHabit)
habitsRouter.get('/', getHabits)
habitsRouter.get('/:id', getHabit)
habitsRouter.patch('/:id', updateHabit)
habitsRouter.delete('/:id', deleteHabit)

habitsRouter.post(
  '/:id/complete',
  validateParams(completeHabitsSchema),
  validateBody(createHabitsSchema),
  (req, res) => {
    res.json({ message: 'habit completed' })
  }
)
