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
import type { PaginationDTO } from "../utils/dtos/PaginationDTO.js";
import { PaginationValidator } from "../validators/PaginationValidator.js";
import type { RequestUpdateAgentDTO } from "../utils/dtos/agent/RequestUpdateAgentDTO.js";
import { Agent } from "../domain/Agent.js";

@injectable()
export class AgentService {
  constructor(
    @inject("AgentImpl") readonly agent: IAgent,
    @inject("AgentPrismaRepository") readonly agentRepository: IAgentRepository
  ) {}

  async create(requestCreateAgentDTO: RequestCreateAgentDTO): Promise<void> {
    await AgentValidator.validateRequestCreateAgentDTO(requestCreateAgentDTO)

    // Validar existência do slug

    const agent = AgentMapper.agentDtoToEntity(requestCreateAgentDTO)

    await this.agentRepository.create(agent)
  }

  async update(dto: RequestUpdateAgentDTO) {
    await AgentValidator.validateRequestUpdateDTO(dto)
    
    const agent = await this.agentRepository.findUnique({ by: { id: dto.id } })
    if (agent === null) {
      throw new NotFoundError("Agent Not Found.")
    }

    agent.setName(dto.name)
    agent.setDescription(dto.description)
    agent.setSlug(dto.slug)
    agent.setPrompt(dto.prompt)
    agent.setModel(dto.model)
    agent.setTemperature(dto.temperature ? Number(dto.temperature) : agent.getTemperature() )

    await this.agentRepository.update(agent)
  }

  async findMany(dto: PaginationDTO): Promise<ResponseAgent[]> {
    const { page, take } = await PaginationValidator.validatePaginationDTO(dto);

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

    const agent = await this.agentRepository.findUnique({ by: { id: uniqueId } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }

    return AgentMapper.EntityToResponseDetailedAgent(agent)
  }

  async ask(requestAgentAskDTO: RequestAgentAskDTO): Promise<ResponseAgentAskDTO> {
    const { question, chatHistory, agentId } = requestAgentAskDTO
    // validar dados
    if (question === "" || question === " ") {
      throw new ValidationError("Dados inválidos!")
    }

    const agent = await this.agentRepository.findUnique({ by: { id: agentId } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }

    const agentResponse = await this.agent.ask(agent, { question, chatHistory })

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

    console.log(chatHistory)

    // retornar resposta
    return response
  }
}