import request from 'supertest'
import app from '../../server.ts'
import {
  cleanDatabase,
  createTestUser,
  createTestHabit,
} from '../../utils/test.utils.ts'

describe('Habits Routes', () => {
  afterEach(async () => {
    await cleanDatabase()
  })

  describe('POST /api/habits', () => {
    it('should create a new habit', async () => {
      const { user, token } = await createTestUser()

      const newHabit = {
        name: 'Morning Exercise',
        description: '30 minutes of cardio',
        frequency: 'daily',
        targetCount: 1,
      }

      const { status, body } = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send(newHabit)

      expect(status).toBe(201)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('habit')
      expect(body.habit).toHaveProperty('id')
      expect(body.habit.name).toBe(newHabit.name)
      expect(body.habit.userId).toBe(user.id)
    })

    it('should create a habit with tags', async () => {
      const { user, token } = await createTestUser()

      const newHabit = {
        name: 'Read Books',
        description: 'Read for 30 minutes',
        frequency: 'daily',
        targetCount: 1,
        tagIds: [],
      }

      const { status, body } = await request(app)
        .post('/api/habits')
        .set('Authorization', `Bearer ${token}`)
        .send(newHabit)

      expect(status).toBe(201)
      expect(body).toHaveProperty('habit')
    })

    it('should fail without authentication', async () => {
      const newHabit = {
        name: 'Morning Exercise',
        frequency: 'daily',
        targetCount: 1,
      }

      const { status } = await request(app).post('/api/habits').send(newHabit)

      expect(status).toBe(401)
    })
  })

  describe('GET /api/habits', () => {
    it('should get all habits for authenticated user', async () => {
      const { user, token } = await createTestUser()
      await createTestHabit(user.id)
      await createTestHabit(user.id)

      const { status, body } = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.length).toBe(2)
      expect(body[0]).toHaveProperty('id')
      expect(body[0]).toHaveProperty('name')
      expect(body[0]).toHaveProperty('tags')
    })

    it('should return empty array when user has no habits', async () => {
      const { token } = await createTestUser()

      const { status, body } = await request(app)
        .get('/api/habits')
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(200)
      expect(Array.isArray(body)).toBe(true)
      expect(body.length).toBe(0)
    })

    it('should fail without authentication', async () => {
      const { status } = await request(app).get('/api/habits')

      expect(status).toBe(401)
    })
  })

  describe('GET /api/habits/:id', () => {
    it('should get a specific habit', async () => {
      const { user, token } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const { status, body } = await request(app)
        .get(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(200)
      expect(body).toHaveProperty('id', habit.id)
      expect(body).toHaveProperty('name', habit.name)
      expect(body).toHaveProperty('tags')
    })

    it('should return 404 for non-existent habit', async () => {
      const { token } = await createTestUser()
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const { status, body } = await request(app)
        .get(`/api/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it("should not get another user's habit", async () => {
      const { user: user1 } = await createTestUser()
      const { token: token2 } = await createTestUser()
      const habit = await createTestHabit(user1.id)

      const { status, body } = await request(app)
        .get(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token2}`)

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it('should fail without authentication', async () => {
      const { user } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const { status } = await request(app).get(`/api/habits/${habit.id}`)

      expect(status).toBe(401)
    })
  })

  describe('PATCH /api/habits/:id', () => {
    it('should update a habit', async () => {
      const { user, token } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const updates = {
        description: 'Updated description',
        targetCount: 2,
      }

      const { status, body } = await request(app)
        .patch(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)

      expect(status).toBe(200)
      expect(body).toHaveProperty('message')
      expect(body).toHaveProperty('habit')
      expect(body.habit.description).toBe(updates.description)
      expect(body.habit.targetCount).toBe(updates.targetCount)
    })

    it('should return 404 for non-existent habit', async () => {
      const { token } = await createTestUser()
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const { status, body } = await request(app)
        .patch(`/api/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Updated' })

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it("should not update another user's habit", async () => {
      const { user: user1 } = await createTestUser()
      const { token: token2 } = await createTestUser()
      const habit = await createTestHabit(user1.id)

      const { status, body } = await request(app)
        .patch(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ description: 'Hacked' })

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it('should fail without authentication', async () => {
      const { user } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const { status } = await request(app)
        .patch(`/api/habits/${habit.id}`)
        .send({ description: 'Updated' })

      expect(status).toBe(401)
    })
  })

  describe('DELETE /api/habits/:id', () => {
    it('should delete a habit', async () => {
      const { user, token } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const { status, body } = await request(app)
        .delete(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(200)
      expect(body).toHaveProperty('message')

      // Verify habit is deleted
      const getResponse = await request(app)
        .get(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(getResponse.status).toBe(404)
    })

    it('should return 404 for non-existent habit', async () => {
      const { token } = await createTestUser()
      const fakeId = '123e4567-e89b-12d3-a456-426614174000'

      const { status, body } = await request(app)
        .delete(`/api/habits/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it("should not delete another user's habit", async () => {
      const { user: user1 } = await createTestUser()
      const { token: token2 } = await createTestUser()
      const habit = await createTestHabit(user1.id)

      const { status, body } = await request(app)
        .delete(`/api/habits/${habit.id}`)
        .set('Authorization', `Bearer ${token2}`)

      expect(status).toBe(404)
      expect(body).toHaveProperty('error')
    })

    it('should fail without authentication', async () => {
      const { user } = await createTestUser()
      const habit = await createTestHabit(user.id)

      const { status } = await request(app).delete(`/api/habits/${habit.id}`)

      expect(status).toBe(401)
    })
  })
})
