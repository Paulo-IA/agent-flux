export class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
    this.name = this.constructor.name
  }
}