import type { ZodError } from 'zod'

export const formatErrorDetails = (error: ZodError) =>
  error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }))
