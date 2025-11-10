import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'
import { formatErrorDetails } from './validation.utils.ts'

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid body',
          details: formatErrorDetails(error),
        })
      }
      next(error)
    }
  }

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid params',
          details: formatErrorDetails(error),
        })
      }
      next(error)
    }
  }

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid query',
          details: formatErrorDetails(error),
        })
      }
      next(error)
    }
  }
