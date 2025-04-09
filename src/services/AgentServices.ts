import { inject, injectable } from "tsyringe";
import type { RequestAgentAskDTO } from "../utils/dtos/agent/RequestAgentAskDTO.js";
import type { ResponseAgentAskDTO } from "../utils/dtos/agent/ResponseAgentAskDTO.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { IAgent } from "../interfaces/IAgent.js";
import type { RequestCreateAgentDTO } from "../utils/dtos/agent/RequestCreateAgentDTO.js";
import { AgentValidator } from "../validators/AgentValidator.js";
import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { AgentMapper } from "../utils/mappers/AgentMapper.js";
import type { RequestFindManyAgentsDTO } from "../utils/dtos/agent/RequestFindManyAgentsDTO.js";
import type { ResponseAgent } from "../types/agent/ResponseAgent.js";
import type { ResponseDetailedAgent } from "../types/agent/ResponseDetailedAgent.js";
import type { RequestFindUniqueAgentDTO } from "../utils/dtos/agent/RequestFindUniqueAgentDTO.js";
import { NotFoundError } from "../errors/NotFoundError.js";

@injectable()
export class AgentService {
  constructor(
    @inject("AgentImpl") readonly agent: IAgent,
    @inject("AgentPrismaRepository") readonly agentRepository: IAgentRepository
  ) {}

  async create(requestCreateAgentDTO: RequestCreateAgentDTO): Promise<void> {
    await AgentValidator.validateRequestCreateAgentDTO(requestCreateAgentDTO)

    const agent = AgentMapper.agentDtoToEntity(requestCreateAgentDTO)

    await this.agentRepository.create(agent)
  }

  async findMany(requestFindManyAgentsDTO: RequestFindManyAgentsDTO): Promise<ResponseAgent[]> {
    const { page, take } = await AgentValidator.validateRequestFindManyAgentDTO(requestFindManyAgentsDTO);

    const agents = await this.agentRepository.findMany(page, take)
    
    return agents.map(agent => {
      return {
        id: agent.getId(),
        name: agent.getName(),
        slug: agent.getSlug(),
        description: agent.getDescription(),
        createdAt: agent.getCreatedAt()
      }
    })
  }

  async findUnique(requestFindUniqueAgentsDTO: RequestFindUniqueAgentDTO): Promise<ResponseDetailedAgent> {
    const { uniqueId } =  await AgentValidator.validateRequestFindUniqueDTO(requestFindUniqueAgentsDTO)

    const agent = await this.agentRepository.findUnique(uniqueId)
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }

    return AgentMapper.EntityToResponseDetailedAgent(agent)
  }

  async ask(requestAgentAskDTO: RequestAgentAskDTO): Promise<ResponseAgentAskDTO> {
    const { question, chatHistory } = requestAgentAskDTO
    // validar dados
    if (question === "" || question === " ") {
      throw new ValidationError("Dados inválidos!")
    }

    // usar Agent injetado
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