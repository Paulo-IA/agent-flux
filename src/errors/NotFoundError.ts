import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(public message: string) {
    super(message, 404)
  }
}