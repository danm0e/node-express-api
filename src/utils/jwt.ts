import { SignJWT, jwtVerify } from 'jose'
import { createSecretKey } from 'node:crypto'
import env from '../../env.ts'

const secret = env.JWT_SECRET
const secretKey = createSecretKey(secret, 'utf-8')

export interface JwtPayload {
  id: string
  email: string
  username: string
  [key: string]: unknown
}

export const generateToken = (payload: JwtPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secretKey)
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const { payload } = await jwtVerify(token, secretKey)
  return payload as JwtPayload
}
