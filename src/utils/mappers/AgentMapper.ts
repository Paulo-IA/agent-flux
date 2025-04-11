import { Agent } from "../../domain/Agent.js";
import type { ResponseDetailedAgent } from "../../types/agent/ResponseDetailedAgent.js";
import type { RequestCreateAgentDTO } from "../dtos/agent/RequestCreateAgentDTO.js";
import type { ResponseFindUniqueAgentDTO } from "../dtos/agent/ResponseFindUniqueAgentDTO.js";

export class AgentMapper {
  static agentDtoToEntity(requestCreateAgentDTO: RequestCreateAgentDTO): Agent {
    return new Agent(
      "",
      requestCreateAgentDTO.name,
      requestCreateAgentDTO.slug,
      requestCreateAgentDTO.description ? requestCreateAgentDTO.description : "",
      requestCreateAgentDTO.prompt,
      requestCreateAgentDTO.model,
      requestCreateAgentDTO.temperature,
      requestCreateAgentDTO.maxTokens,
      undefined,
      undefined,
      undefined,
      requestCreateAgentDTO.userId,
      new Date(0),
      new Date(0)
    )
  }

  static EntityToResponseDetailedAgent(agent: Agent): ResponseDetailedAgent {
    return {
      id: agent.getId(),
      name: agent.getName(),
      slug: agent.getSlug(),
      description: agent.getDescription(),
      prompt: agent.getPrompt(),
      model: agent.getModel(),
      temperature: agent.getTemperature(),
      maxTokens: agent.getMaxTokens(),
      createdAt: agent.getCreatedAt(),
      updatedAt: agent.getUpdatedAt()
    }
  }
}