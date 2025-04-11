import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { PrismaClient } from "@prisma/client";
import { Agent } from "../domain/Agent.js";
import type { FindUniqueQuery } from "../types/agent/FindUniqueQuery.js";

export class AgentPrismaRepository implements IAgentRepository {
  constructor(readonly prisma: PrismaClient = new PrismaClient()) {}

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
      agent.updatedAt
    )
  }

}