import type { Request, Response, NextFunction } from 'express'
import { env } from '@root/env'
import type { ApiError } from '@/classes'

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)

  let status = err.status || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'ValidationError') {
    status = 400
    message = 'Validation Error'
  }

  if (err.name === 'UnauthorisedError') {
    status = 401
    message = 'Unauthorised'
  }

  return res.status(status).json({
    error: message,
    ...(env.APP_STAGE === 'dev' && { stack: err.stack, details: err }), // adds additional logging for dev env
  })
}
