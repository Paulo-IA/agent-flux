import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import type { ILlmKeyRepository } from "../interfaces/ILlmKeyRepository.js";
import type { CreateLlmKeyData } from "../types/llmKey/CreateLlmKeyData.js";
import { LlmKey } from "../domain/LlmKey.js";
import type { FindUniqueQuery } from "../types/llmKey/FindUniqueQuery.js";

@injectable()
export class LlmKeyPrismaRepository implements ILlmKeyRepository {
  constructor(
    private readonly prisma: PrismaClient = new PrismaClient()
  ) {}

  // create()
  async create(data: LlmKey): Promise<void> {
    await this.prisma.lLMKey.create({
      data: {
        title: data.getTitle(),
        key: data.getKey(),
        agentId: data.getAgentId()
      }
    })
  }

  async findUnique({ by }: FindUniqueQuery): Promise<LlmKey | null> {
    const where = by.id ? { id: by.id } : (
      by.agentId ? { agentId: by.agentId } : (
        { title: by.title }
      )
    )
    
    const llmKey = await this.prisma.lLMKey.findFirst({
      where
    })
    if(llmKey === null) {
      return null
    } 

    return new LlmKey(
      llmKey.id,
      llmKey.title,
      llmKey.key,
      llmKey.agentId,
      llmKey.createdAt,
      llmKey.updatedAt,
    )
  }

  async findMany(page: number, take: number): Promise<LlmKey[]> {
    const llmKeys = await this.prisma.lLMKey.findMany({
      skip: (page - 1) * take,
      take,
      orderBy: {
        createdAt: "desc"
      }
    })

    return llmKeys.map(llmKey => {
      return new LlmKey(
        llmKey.id,
        llmKey.title,
        llmKey.key,
        llmKey.agentId,
        llmKey.createdAt,
        llmKey.updatedAt
      )
    })
  }
}