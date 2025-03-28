import { AppError } from "./AppError.js";

export class ValidationError extends AppError {
  constructor(public message: string) {
    super(message, 400)
  }
}