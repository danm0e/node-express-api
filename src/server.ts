import express from 'express'
import {
  authRouter,
  habitsRouter,
  healthRouter,
  usersRouter,
} from './routes/index.ts'

const app = express()

app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/habits', habitsRouter)

export { app }
export default app
