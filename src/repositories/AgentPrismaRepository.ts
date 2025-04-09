import { inject, injectable } from "tsyringe";
import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { PrismaClient } from "@prisma/client";
import { Agent } from "../domain/Agent.js";

@injectable()
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

  async findUnique(uniqueId: string): Promise<Agent | null> {
    const agent = await this.prisma.agent.findFirst({
      where: {
        OR: [
          { id: uniqueId },
          { slug: uniqueId }
        ]
      }
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