import { Router } from 'express'

export const habitsRouter = Router()

habitsRouter.get('/', (req, res) => {
  res.json({ message: 'habits' })
})

habitsRouter.get('/:id', (req, res) => {
  res.json({ message: 'got one habit' })
})

habitsRouter.post('/', (req, res) => {
  res.json({ message: 'habit created' })
})

habitsRouter.delete('/:id', (req, res) => {
  res.json({ message: 'habit deleted' })
})

habitsRouter.post('/id/complete', (req, res) => {
  res.json({ message: 'habit completed' })
})
