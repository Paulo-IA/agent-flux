import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { env } from "../env.js";
import { container } from "tsyringe";
import { ApiKeyValidatorService } from "../services/ApiKeyValidatorService.js";

export async function ApiKeyAuth(req: FastifyRequest, reply: FastifyReply) {
  const apikey = req.headers["x-api-key"]
  const keyValidator = container.resolve(ApiKeyValidatorService);

  const response = await keyValidator.validateApiKey(apikey as string)

  if (!apikey || !response.valid) {
    throw new UnauthorizedError("Chave de API inválida ou não fornecida!");
  }

  (req.raw as any).agentId = response.agentId
}