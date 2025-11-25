import bcrypt from 'bcrypt'
import { env } from '@root/env'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = env.BCRYPT_ROUNDS
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => bcrypt.compare(password, hashedPassword)
