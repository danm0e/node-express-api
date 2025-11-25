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
    const token = authHeader.split(' ')[1]

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Authorization header missing or malformed' })
    }

    const payload = await verifyToken(token)
    console.log('Authenticated user:', payload)
    req.user = payload
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(403).json({ error: 'Forbidden' })
  }
}
