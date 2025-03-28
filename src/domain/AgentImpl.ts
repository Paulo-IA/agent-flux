import { injectable } from "tsyringe";
import type { IAgent } from "../interfaces/IAgent.js";
import type { QuestionInfos } from "../types/QuestionInfos.js";
import { Agent } from "../utils/agent/Agent.js";
import { OPENAI_API_KEY } from "../utils/env.js";

@injectable()
export class AgentImpl implements IAgent {
  async ask(questionInfos: QuestionInfos): Promise<string> {
    const { question, chatHistory } = questionInfos
    
    // This info will be from db
    const pathToMemory = import.meta.dirname.split('domain')[0] + "public/iris_memory.csv"
    const prompt = "Termine todas as suas frases com o sotaque gaúcho."
    const agent = new Agent(OPENAI_API_KEY, prompt, pathToMemory)

    const { response } = await agent.ask(question, chatHistory)

    return response

  }
  
}