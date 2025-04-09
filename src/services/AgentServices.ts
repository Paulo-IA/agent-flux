import { inject, injectable } from "tsyringe";
import type { RequestAgentAskDTO } from "../utils/dtos/agent/RequestAgentAskDTO.js";
import type { ResponseAgentAskDTO } from "../utils/dtos/agent/ResponseAgentAskDTO.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { IAgent } from "../interfaces/IAgent.js";

@injectable()
export class AgentService {
  constructor(
    @inject("AgentImpl") readonly agent: IAgent
  ) {}

  async ask(requestAgentAskDTO: RequestAgentAskDTO): Promise<ResponseAgentAskDTO> {
    const { question, chatHistory } = requestAgentAskDTO
    // validar dados
    if (question === "" || question === " ") {
      throw new ValidationError("Dados inválidos!")
    }

    // Procurar agente da Key
    const agentResponse = await this.agent.ask({ question, chatHistory })

    chatHistory.push({
      role: "user",
      content: question
    })

    chatHistory.push({
      role: "assistant",
      content: agentResponse
    })

    const response: ResponseAgentAskDTO = {
      response: agentResponse,
      chatHistory
    }

    // retornar resposta
    return response
  }
}