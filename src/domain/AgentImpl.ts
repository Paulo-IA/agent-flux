import { inject, injectable } from "tsyringe";
import type { IAgent } from "../interfaces/IAgent.js";
import type { QuestionInfos } from "../types/QuestionInfos.js";
import { Agent } from "../utils/agent/Agent.js";
import { Agent as AgentDomain } from "../domain/Agent.js"
import { z } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { ICryptography } from "../interfaces/ICryptography.js";

@injectable()
export class AgentImpl implements IAgent {
  constructor(
    @inject("CryptoService") readonly cryptographyService: ICryptography
  ) {}

  private pathToMemory: string = import.meta.dirname.split('domain')[0] + "public/iris_memory.csv"

  async ask(agentDomain: AgentDomain, questionInfos: QuestionInfos): Promise<string> {
    const { question, chatHistory } = questionInfos
    
    // Validate properties (AgentValidator??)
    const schema = z.object({
      llmKey: z.string().nonempty("A chave de API não pode ser vazia"),
      prompt: z.string().nonempty("O prompt não pode ser vazio")
    })

    const llmKey = agentDomain.getLlmKey()
    if (llmKey === undefined) {
      throw new NotFoundError("Nenhuma chave de API encontrada!")
    }

    const llmKeyValue = this.cryptographyService.decrypt(llmKey.getKey())

    const res = await schema.safeParseAsync({
      llmKey: llmKeyValue,
      prompt: agentDomain.getPrompt()
    })
    if(!res.success) {
      throw new ValidationError(res.error.issues[0].message)
    }
    // Validation end

    const agent = new Agent(llmKeyValue, agentDomain.getPrompt(), this.pathToMemory)

    const { response } = await agent.ask(question, chatHistory)

    return response
  }
}