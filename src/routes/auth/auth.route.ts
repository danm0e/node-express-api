import { Router } from 'express'
import { validateBody } from '../../middleware/index.ts'
import { insertUserSchema } from '../../db/schema.ts'
import { register, login } from '../../controllers/authController.ts'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const authRouter = Router()

authRouter.post('/register', validateBody(insertUserSchema), register)

authRouter.post('/login', validateBody(loginSchema), login)
