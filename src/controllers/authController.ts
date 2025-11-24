import type { Request, Response } from 'express'
import { db, users } from '../db/index.ts'
import {
  generateToken,
  hashPassword,
  comparePasswords,
} from '../utils/index.ts'
import type { NewUser } from '../db/schema.ts'
import { eq } from 'drizzle-orm'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response
) => {
  try {
    const { password } = req.body
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const isValidPassword = await comparePasswords(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    res.json({
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to log in user' })
  }
}
