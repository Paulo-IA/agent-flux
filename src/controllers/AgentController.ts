import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { RequestAgentAskDTO } from "../utils/dtos/agent/RequestAgentAskDTO.js";
import type { ResponseAgentAskDTO } from "../utils/dtos/agent/ResponseAgentAskDTO.js";
import type { AgentService } from "../services/AgentServices.js";

@injectable()
export class AgentController {
  constructor(
    @inject("AgentService") readonly agentService: AgentService
  ) {}

  async ask(req: FastifyRequest, reply: FastifyReply): Promise<ResponseAgentAskDTO> {
    const requestAgentAskDto = req.body as RequestAgentAskDTO
    
    const response = await this.agentService.ask(requestAgentAskDto)

    return reply.send(response)
  }
}