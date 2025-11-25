import request from 'supertest'
import app from '@/server'
import { env } from '@root/env'
import { cleanDatabase, createTestHabit, createTestUser } from '@/utils'

describe('Auth Routes', () => {
  afterEach(async () => {
    await cleanDatabase()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const testUser = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      }

      const { status, body } = await request(app)
        .post('/api/auth/register')
        .send(testUser)

      expect(status).toBe(201)
      expect(body).toHaveProperty('user')
      expect(body).toHaveProperty('token')
      expect(body.user).not.toHaveProperty('password')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login in with valid credentials', async () => {
      const { user, rawPassword } = await createTestUser()

      const credentials = {
        email: user.email,
        password: rawPassword,
      }

      const { status, body } = await request(app)
        .post('/api/auth/login')
        .send(credentials)

      expect(status).toBe(201)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('user')
      expect(body).toHaveProperty('token')
      expect(body.user).not.toHaveProperty('password')
    })
  })
})
