import { AppError } from "./AppError.js";

export class ConflictError extends AppError {
  constructor(public message: string) {
    super(message, 409)
  }
}