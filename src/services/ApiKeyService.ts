import { inject, injectable } from "tsyringe";
import type { RequestCreateApiKeyDTO } from "../utils/dtos/apiKey/RequestCreateApiKeyDTO.js";
import type { IApiKeyRepository } from "../interfaces/IApiKeyRepository.js";
import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ApiKeyValidator } from "../validators/ApiKeyValidator.js";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt"
import { ApiKey } from "../domain/ApiKey.js";

const CURRENT_YEAR = new Date().getFullYear()

@injectable()
export class ApiKeyService {
  private SALT_ROUNDS = 10

  constructor(
    @inject("ApiKeyPrismaRepository") readonly apiKeyRepository: IApiKeyRepository,
    @inject("AgentPrismaRepository") readonly agentRepository: IAgentRepository
  ) {}

  async create(dto: RequestCreateApiKeyDTO): Promise<string> {
    const { title, agentId } = await ApiKeyValidator.validateRequestCreateApiKeyDTO(dto)
    
    const agent = await this.agentRepository.findUnique({ by: { id: agentId } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }
    
    const apiKeyValue = `AFX${CURRENT_YEAR}-${randomUUID()}`
    const hashedApiKey = await bcrypt.hash(apiKeyValue, this.SALT_ROUNDS)
    
    const apiKey = new ApiKey("", title, hashedApiKey, agentId, new Date(0), new Date(0))
    
    await this.apiKeyRepository.create(apiKey)

    return apiKeyValue
  }
}