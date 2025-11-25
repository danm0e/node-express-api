import type { Request, Response, NextFunction } from 'express'
import { type JwtPayload, verifyToken } from '../../utils/index.ts'

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Authorization token malformed' })
    }

    const payload = await verifyToken(token)
    console.log('Authenticated user:', payload)
    req.user = payload
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
