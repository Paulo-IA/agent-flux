import { inject, injectable } from "tsyringe";
import type { RequestCreateApiKeyDTO } from "../utils/dtos/apiKey/RequestCreateApiKeyDTO.js";
import type { IApiKeyRepository } from "../interfaces/IApiKeyRepository.js";
import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { ApiKeyValidator } from "../validators/ApiKeyValidator.js";
import { createHash, randomUUID } from "node:crypto";
import bcrypt from "bcrypt"
import { ApiKey } from "../domain/ApiKey.js";
import type { ResponseValidateApiKey } from "../types/apiKey/keyValidator/ResponseValidateApiKey.js";

const CURRENT_YEAR = new Date().getFullYear()

@injectable()
export class ApiKeyService {
  private SALT_ROUNDS = 10

  constructor(
    @inject("ApiKeyPrismaRepository") readonly apiKeyRepository: IApiKeyRepository,
    @inject("AgentPrismaRepository") readonly agentRepository: IAgentRepository
  ) { }

  async create(dto: RequestCreateApiKeyDTO): Promise<string> {
    const { title, agentId } = await ApiKeyValidator.validateRequestCreateApiKeyDTO(dto)

    const agent = await this.agentRepository.findUnique({ by: { id: agentId } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }

    const apiKeyValue = `aFx${CURRENT_YEAR}_${agent.getId()}_${randomUUID()}`
    const sha256 = createHash("sha256").update(apiKeyValue).digest("hex");
    const hashedApiKey = await bcrypt.hash(sha256, this.SALT_ROUNDS)

    const apiKey = new ApiKey("", title, hashedApiKey, agentId, new Date(0), new Date(0))

    await this.apiKeyRepository.create(apiKey)

    return apiKeyValue
  }

  async findMany(agentId: string): Promise<ApiKey[]> {
    return await this.apiKeyRepository.findMany({
      by: {
        agentId
      }
    })
  }

  async validate(reqKey: string): Promise<ResponseValidateApiKey> {
    const agentId = reqKey.split("_")[1]

    const apiKeys = await this.apiKeyRepository.findMany({
      by: {
        agentId
      }
    })
    if (apiKeys === null) {
      throw new NotFoundError("Nenhuma chave encontrada!")
    }

    const apiKeyFound = await Promise.all(
      apiKeys.map(async (apiKey) => {
        const sha256 = createHash("sha256").update(reqKey).digest("hex");
        const isMatch = await bcrypt.compare(sha256, apiKey.getKey());

        return { apiKey, isMatch };
      })
    ).then((results) => results.find((result) => result.isMatch)?.apiKey);

    if (!apiKeyFound) {
      throw new NotFoundError("Chave inválida!")
    }

    return {
      valid: true,
      agentId: apiKeyFound.getAgentId()
    }

  }
}