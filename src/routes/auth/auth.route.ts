import { Router } from 'express'
import { validateBody } from '../../middleware/index.ts'
import { insertUserSchema } from '../../db/schema.ts'
import { register } from '../../controllers/authController.ts'

export const authRouter = Router()

authRouter.post('/register', validateBody(insertUserSchema), register)

authRouter.post('/login', (req, res) => {
  res.json({ message: 'user logged in' })
})
