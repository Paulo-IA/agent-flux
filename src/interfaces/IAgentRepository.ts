import type { Agent } from "../domain/Agent.js";

export interface IAgentRepository {
  create(agent: Agent): Promise<void>
  findMany(page: number, take: number): Promise<Agent[]>
  findUnique(uniqueId: string): Promise<Agent | null>

}