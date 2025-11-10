import { Router } from 'express'

export const usersRouter = Router()

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
