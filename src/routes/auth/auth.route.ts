import { Router } from 'express'
import { validateBody } from '@/middleware'
import { insertUserSchema } from '@/db/schema'
import { register, login } from '@/controllers'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const authRouter = Router()

authRouter.post('/register', validateBody(insertUserSchema), register)

authRouter.post('/login', validateBody(loginSchema), login)
