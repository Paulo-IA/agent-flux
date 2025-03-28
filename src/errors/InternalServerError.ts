import { AppError } from "./AppError.js";

export class InternalServerError extends AppError {
  constructor(public message: string = "Erro interno do servidor.") {
    super(message, 500)
  }
}