import type { Agent } from "../domain/Agent.js";
import type { FindUniqueQuery } from "../types/agent/FindUniqueQuery.js";

export interface IAgentRepository {
  create(agent: Agent): Promise<void>
  findMany(page: number, take: number): Promise<Agent[]>
  findUnique(by: FindUniqueQuery): Promise<Agent | null>
  update(agent: Agent): Promise<void>
}