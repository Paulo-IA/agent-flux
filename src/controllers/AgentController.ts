import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "tsyringe";
import type { RequestAgentAskDTO } from "../utils/dtos/agent/RequestAgentAskDTO.js";
import type { ResponseAgentAskDTO } from "../utils/dtos/agent/ResponseAgentAskDTO.js";
import type { AgentService } from "../services/AgentServices.js";
import type { RequestCreateAgentDTO } from "../utils/dtos/agent/RequestCreateAgentDTO.js";
import { getUserFromRequest } from "../utils/getUserFromRequest.js";
import type { ResponseFindManyAgentsDTO } from "../utils/dtos/agent/ResponseFindManyAgentsDTO.js";
import type { RequestFindManyAgentsDTO } from "../utils/dtos/agent/RequestFindManyAgentsDTO.js";
import type { RequestFindUniqueAgentDTO } from "../utils/dtos/agent/RequestFindUniqueAgentDTO.js";
import type { ResponseFindUniqueAgentDTO } from "../utils/dtos/agent/ResponseFindUniqueAgentDTO.js";
import type { PaginationDTO } from "../utils/dtos/PaginationDTO.js";

@injectable()
export class AgentController {
  constructor(
    @inject("AgentService") readonly agentService: AgentService
  ) {}

  async create(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const requestCreateAgentDTO = req.body as RequestCreateAgentDTO
    const user = getUserFromRequest(req)
    
    requestCreateAgentDTO["userId"] = user.id

    await this.agentService.create(requestCreateAgentDTO)
    
    return reply.status(201).send()
  }

  async findMany(req: FastifyRequest, reply: FastifyReply): Promise<ResponseFindManyAgentsDTO> {
    const dto = req.query as PaginationDTO

    const agents = await this.agentService.findMany(dto)
    
    return reply.send({ agents })
  }

  async findUnique(req: FastifyRequest, reply: FastifyReply): Promise<ResponseFindUniqueAgentDTO> {
    const requestFindUniqueAgentDTO = req.params as RequestFindUniqueAgentDTO

    const agent = await this.agentService.findUnique(requestFindUniqueAgentDTO);

    return reply.send({ agent })
  }

  async ask(req: FastifyRequest, reply: FastifyReply): Promise<ResponseAgentAskDTO> {
    const requestAgentAskDto = req.body as RequestAgentAskDTO
    
    const response = await this.agentService.ask(requestAgentAskDto)

    return reply.send(response)
  }
}