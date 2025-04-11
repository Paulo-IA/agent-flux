import type { IApiKeyRepository } from "../interfaces/IApiKeyRepository.js";
import type { ApiKey } from "../domain/ApiKey.js";
import { PrismaClient } from "@prisma/client";

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

}