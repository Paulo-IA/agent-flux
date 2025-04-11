import { LlmKey } from "../../domain/LlmKey.js";
import type { ResponseLlmKey } from "../../types/llmKey/ResponseLlmKey.js";
import type { RequestCreateLlmKeyDTO } from "../dtos/llmKeys/RequestCreateLlmKeyDTO.js";

export class LlmKeyMapper {
  static requestCreateDtoToEntity(dto: RequestCreateLlmKeyDTO): LlmKey {
    return new LlmKey(
      "",
      dto.title,
      dto.key,
      dto.agentId,
      new Date(),
      new Date()
    )
  }

  static entityToResponseDTO(llmKey: LlmKey): ResponseLlmKey {
    return {
      id: llmKey.getId(),
      title: llmKey.getTitle(),
      key: llmKey.getOcultedKey(),
      agentId: llmKey.getAgentId(),
      createdAt: llmKey.getCreatedAt()
    }
  }
}