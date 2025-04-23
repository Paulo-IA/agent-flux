import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { LlmKeyService } from "../services/LlmKeyService.js";
import type { PaginationDTO } from "../utils/dtos/PaginationDTO.js";
import type { RequestCreateLlmKeyDTO } from "../utils/dtos/llmKeys/RequestCreateLlmKeyDTO.js";

@injectable()
export class LlmKeyController {

  // Dependency Injection
  constructor(
    @inject("LlmKeyService") readonly llmKeyService: LlmKeyService
  ) {}

  // @POST("/llm-keys")
  async create(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const dto = req.body as RequestCreateLlmKeyDTO

    await this.llmKeyService.create(dto)
    
    return reply.status(201).send()
  }

  // @GET("/llm-keys")
  async findMany(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const dto = req.params as PaginationDTO
    
    const llmKeys = await this.llmKeyService.findMany(dto)
    
    return reply.send({ llmKeys })
  }

  // @GET("/llm-keys/find/:id")
}