import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../errors/AppError.js";

export function ErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: FastifyError | AppError, req: FastifyRequest, reply: FastifyReply) => {
    console.log("erro capturado: " + err.stack)

    if (err instanceof AppError) {
      return reply.status(err.status).send({
        status: "Error",
        message: err.message,
        code: err.status
      })
    }

      const status = err.statusCode || 500;
      return reply.status(status).send({
        status: "Error",
        message: "Erro Interno do servidor",
        code: status
      })
  }) 
}