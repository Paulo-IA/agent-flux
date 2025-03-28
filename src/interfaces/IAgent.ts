import type { QuestionInfos } from "../types/QuestionInfos.js";

export interface IAgent {
  ask(questionInfos: QuestionInfos): Promise<string>
}