export class ApiError extends Error {
  name: string
  message: string
  status: number

  constructor(name: string, message: string, status: number) {
    super(message)
    this.status = status
    this.name = name
    this.message = message
  }
}
