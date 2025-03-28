import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export function getUserFromRequest(req: FastifyRequest) {
  const userCookies = req.cookies["user"]
  if (!userCookies) {
    throw new UnauthorizedError("Usuário Não Autenticado")
  }

  return JSON.parse(userCookies) as { id: string, email: string }
}