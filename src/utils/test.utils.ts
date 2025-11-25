import { db } from '../../src/db/connection.ts'
import {
  users,
  habits,
  entries,
  tags,
  habitTags,
  type NewUser,
  type NewHabit,
} from '../../src/db/schema.ts'
import { generateToken, hashPassword } from './index.ts'

export const createTestUser = async (overrides: Partial<NewUser> = {}) => {
  // set up the "collision free" data so there are no conflicts
  const defaultUser = {
    username: `testuser-${Date.now()}-${Math.random()}`,
    email: `testuser-${Date.now()}-${Math.random()}@example.com`,
    password: 'adminpassword1234',
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
  }

  const hashedPassword = await hashPassword(defaultUser.password)

  const [user] = await db
    .insert(users)
    .values({ ...defaultUser, password: hashedPassword })
    .returning()

  const token = await generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return { user, token, rawPassword: defaultUser.password }
}

export const createTestHabit = async (
  userId: string,
  overrides: Partial<NewHabit> = {}
) => {
  const defaultHabit = {
    name: `Test Habit ${Date.now()}`,
    frequency: 'daily',
    targetCount: 1,
    ...overrides,
  }

  const [habit] = await db
    .insert(habits)
    .values({ userId, ...defaultHabit })
    .returning()

  return habit
}

export const cleanDatabase = async () => {
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
  await db.delete(tags)
  await db.delete(habitTags)
}
