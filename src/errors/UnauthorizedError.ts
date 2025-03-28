import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
  constructor(public message: string) {
    super(message, 401)
  }
}