import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { SAMPLE_KEY } from "../utils/env.js";

function validateApiKey(reqKey: string) {
  if (reqKey !== SAMPLE_KEY) {
    return false
  }

  return true
}

export async function ApiKeyAuth(req: FastifyRequest, reply: FastifyReply) {
  const apikey = req.headers["x-api-key"]
  if (!apikey || !(validateApiKey(apikey as string))) {
    throw new UnauthorizedError("Chave de API inválida ou não fornecida!");
  }
}