import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { db, users } from '../db/index.ts'
import { generateToken, hashPassword } from '../utils/index.ts'
import type { NewUser } from '../db/schema.ts'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response
) => {
  try {
    const { username, email, password, firstName, lastName } = req.body
    const hashedPassword = await hashPassword(password)

    const [newUser] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      // specify only the fields we want to return, i.e do not expose the password hash
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
}
