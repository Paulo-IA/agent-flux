import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { RequestCreateApiKeyDTO } from "../utils/dtos/apiKey/RequestCreateApiKeyDTO.js";
import type { ApiKeyService } from "../services/ApiKeyService.js";
import type { RequestBodyCreate } from "../types/apiKey/RequestBodyCreate.js";
import type { RequestParamsCreate } from "../types/apiKey/RequestParamsCreate.js";

@injectable()
export class ApiKeyController {
  constructor(
    @inject("ApiKeyService") readonly apiKeyService: ApiKeyService
  ) {}

  // @POST("/api-key/:agentId")
  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const { agentId } = req.params as RequestParamsCreate
    const { title } = req.body as RequestBodyCreate

    const dto = {
      agentId,
      title
    } as RequestCreateApiKeyDTO

    const apiKey = await this.apiKeyService.create(dto)

    return reply.status(201).send({ apiKey })
  }
}