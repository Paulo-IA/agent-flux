import { PrismaClient } from "@prisma/client";
import { injectable } from "tsyringe";
import type { ILlmKeyRepository } from "../interfaces/ILlmKeyRepository.js";
import { LlmKey } from "../domain/LlmKey.js";
import type { FindUniqueQuery } from "../types/llmKey/FindUniqueQuery.js";

export class LlmKeyPrismaRepository implements ILlmKeyRepository {
  constructor(
    private readonly prisma: PrismaClient = new PrismaClient()
  ) {}

  // create()
  async create(llmKey: LlmKey): Promise<void> {
    await this.prisma.lLMKey.create({
      data: {
        title: llmKey.getTitle(),
        key: llmKey.getKey(),
        agentId: llmKey.getAgentId()
      }
    })
  }

  async findUnique({ by }: FindUniqueQuery): Promise<LlmKey | null> {
    const where = by.id ? { id: by.id } : { agentId: by.agentId }
    
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