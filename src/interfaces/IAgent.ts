import type { Agent } from "../domain/Agent.js";
import type { QuestionInfos } from "../types/QuestionInfos.js";

export interface IAgent {
  ask(agent: Agent, questionInfos: QuestionInfos): Promise<string>
}