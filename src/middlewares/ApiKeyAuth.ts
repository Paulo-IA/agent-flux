import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { env } from "../env.js";
import { inject, injectable } from "tsyringe";
import type { ApiKeyService } from "../services/ApiKeyService.js";

@injectable()
class KeyValidator {
  constructor(
    @inject("ApiKeyService") readonly apiKeyService: ApiKeyService
  ) {}

  static async validateApiKey(reqKey: string) {
    // Bater no banco
    // const apiKey = apiKeyService.findUnique({ by: { key: reqKey } })
  
  
    // Procurar a chave
    // Validar
    // Retornar id do agent
    if (reqKey !== env.SAMPLE_KEY) {
      return false
    }
  
    return true
  }
}



export async function ApiKeyAuth(req: FastifyRequest, reply: FastifyReply) {
  const apikey = req.headers["x-api-key"]
  if (!apikey || !(KeyValidator.validateApiKey(apikey as string))) {
    throw new UnauthorizedError("Chave de API inválida ou não fornecida!");
  }
}