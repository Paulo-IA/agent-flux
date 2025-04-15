import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { PrismaClient } from "@prisma/client";
import { Agent } from "../domain/Agent.js";
import type { FindUniqueQuery } from "../types/agent/FindUniqueQuery.js";
import { inject } from "tsyringe";
import type { ApiKeyService } from "../services/ApiKeyService.js";
import { ApiKey } from "../domain/ApiKey.js";
import { LlmKey } from "../domain/LlmKey.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class AgentPrismaRepository implements IAgentRepository {
  constructor(
    readonly prisma: PrismaClient = new PrismaClient()
  ) {}

  async create(agent: Agent): Promise<void> {
    await this.prisma.agent.create({
      data: {
        name: agent.getName(),
        description: agent.getDescription(),
        slug: agent.getSlug(),
        prompt: agent.getPrompt(),
        model: agent.getModel(),
        temperature: agent.getTemperature(),
        maxTokens: agent.getMaxTokens(),
        userId: agent.getUserId()
      }
    })
  }

  async findMany(page: number, take: number): Promise<Agent[]> {
    const agents = await this.prisma.agent.findMany({
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        name: 'asc'
      }
    })

    return agents.map(agent => {
      return new Agent(
        agent.id,
        agent.name,
        agent.slug,
        agent.description ? agent.description : "",
        agent.prompt,
        agent.model,
        Number(agent.temperature),
        agent.maxTokens,
        undefined,
        undefined,
        undefined,
        agent.userId,
        agent.createdAt,
        agent.updatedAt,
      )
    })
  }

  async findUnique({ by }: FindUniqueQuery): Promise<Agent | null> {
    const where = by.id ? { id: by.id } : (
      by.slug ? { slug: by.slug } : (
        {
          OR: [
            { id: by.uniqueId },
            { slug: by.uniqueId }
          ]
        }
      )
    )
    
    const agent = await this.prisma.agent.findFirst({
      where,
    })

    if(agent===null) return null

    // REMOVER - Para outro arquivo
    const foundApiKeys = await this.prisma.apiKey.findMany({
      where: {
        agentId: agent.id
      }
    })

    const apiKeys = foundApiKeys.map(apiKey => {
      return new ApiKey(
        apiKey.id,
        apiKey.title,
        apiKey.key,
        apiKey.agentId,
        apiKey.createdAt,
        apiKey.updatedAt
      )
    })

    const foundLlmKey = await this.prisma.lLMKey.findFirst({
      where: {
        agentId: agent.id
      }
    })

    const llmKey = foundLlmKey===null ? undefined : new LlmKey(
      foundLlmKey.id,
      foundLlmKey.title,
      foundLlmKey.key,
      foundLlmKey.agentId,
      foundLlmKey.createdAt,
      foundLlmKey.updatedAt
    )
    // REMOVER

    return new Agent(
      agent.id,
      agent.name,
      agent.slug,
      agent.description ? agent.description : "",
      agent.prompt,
      agent.model,
      Number(agent.temperature),
      agent.maxTokens,
      apiKeys,
      llmKey,
      undefined,
      agent.userId,
      agent.createdAt,
      agent.updatedAt
    )
  }

  async update(agent: Agent): Promise<void> {
    const apiKeys = await this.prisma.apiKey.findMany({
      where: {
        agentId: agent.getId()
      }
    })

    await this.prisma.agent.update({
      where: {
        id: agent.getId()
      },
      data: {
        name: agent.getName(),
        slug: agent.getSlug(),
        description: agent.getDescription(),
        prompt: agent.getPrompt(),
        model: agent.getModel(),
        temperature: agent.getTemperature(),
        maxTokens: agent.getMaxTokens(),
        userId: agent.getUserId(),
      }
    })
  }
}