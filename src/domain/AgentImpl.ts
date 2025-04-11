import { injectable } from "tsyringe";
import type { IAgent } from "../interfaces/IAgent.js";
import type { QuestionInfos } from "../types/QuestionInfos.js";
import { Agent } from "../utils/agent/Agent.js";
import { env } from "../env.js";
import { z } from "zod";
import { ValidationError } from "../errors/ValidationError.js";

@injectable()
export class AgentImpl implements IAgent {
  private llmKey: string = ""
  private prompt: string = "Termine todas as suas frases com o sotaque gaúcho."
  private pathToMemory: string = import.meta.dirname.split('domain')[0] + "public/iris_memory.csv"

  async ask(questionInfos: QuestionInfos): Promise<string> {
    const { question, chatHistory } = questionInfos
    
    // Validate properties (AgentValidator??)
    const schema = z.object({
      llmKey: z.string().nonempty("A chave de API não pode ser vazia")
    })

    const res = await schema.safeParseAsync({ llmKey: this.llmKey })
    if(!res.success) {
      throw new ValidationError(res.error.issues[0].message)
    }
    // Validation end

    const agent = new Agent(this.llmKey, this.prompt, this.pathToMemory)

    const { response } = await agent.ask(question, chatHistory)

    return response
  }

  setLlmKey(llmKey: string): void {
    this.llmKey = llmKey
  }
}