import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken"
import { env } from "../env.js";

export async function isAuth(req: FastifyRequest, reply: FastifyReply) {
  const ONE_HOUR = 60 * 60
  const authHeaders = req.headers["authorization"]

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token de Autenticação não fornecido!")
  }

  const token = authHeaders.split(" ")[1]

  let decodedToken: { id: string, email: string }
  try {
    decodedToken = jwt.verify(token, env.JWT_SECRET) as { id: string, email: string }
  } catch (err) {
    throw new UnauthorizedError("Token Inválido!")
  }
  
  reply.setCookie("user", JSON.stringify(decodedToken), {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ONE_HOUR
  });

}