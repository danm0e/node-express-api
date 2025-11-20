import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import { isTest } from '../env.ts'
import {
  authRouter,
  habitsRouter,
  healthRouter,
  usersRouter,
} from './routes/index.ts'

const app = express()
// global middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev', { skip: () => isTest() }))
// routes
app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/habits', habitsRouter)

export { app }
export default app
