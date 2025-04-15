import type { IApiKeyRepository } from "../interfaces/IApiKeyRepository.js";
import { ApiKey } from "../domain/ApiKey.js";
import { PrismaClient } from "@prisma/client";
import type { FindUniqueApiKeyQuery } from "../types/apiKey/FindUniqueApiKeyQuery.js";

export class ApiKeyPrismaRepository implements IApiKeyRepository {

  constructor(private readonly prisma: PrismaClient = new PrismaClient()) {}

  async create(apiKey: ApiKey): Promise<void> {
    await this.prisma.apiKey.create({
      data: {
        title: apiKey.getTitle(),
        key: apiKey.getKey(),
        agentId: apiKey.getAgentId()
      }
    })
  }

  async findMany({ by }: FindUniqueApiKeyQuery): Promise<ApiKey[]> {
    const where = by.agentId ? { agentId: by.agentId } : {}

    const apiKeys = await this.prisma.apiKey.findMany({
      where
    })

    return apiKeys.map(apiKey => {
      return new ApiKey(
        apiKey.id,
        apiKey.title,
        apiKey.key,
        apiKey.agentId,
        apiKey.createdAt,
        apiKey.updatedAt
      )
    })
  }

}