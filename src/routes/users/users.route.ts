import { Router } from 'express'
import { authenticateToken } from '@/middleware/auth'

export const usersRouter = Router()

usersRouter.use(authenticateToken) // use authentication middleware for all user routes

usersRouter.get('/', (req, res) => {
  res.json({ message: 'users' })
})

usersRouter.get('/:id', (req, res) => {
  res.json({ message: 'got one user' })
})

usersRouter.post('/', (req, res) => {
  res.json({ message: 'user created' })
})

usersRouter.put('/:id', (req, res) => {
  res.json({ message: 'user updated' })
})

usersRouter.delete('/:id', (req, res) => {
  res.json({ message: 'user deleted' })
})
