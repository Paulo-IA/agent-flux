import { z } from "zod";
import type { RequestCreateLlmKeyDTO } from "../utils/dtos/llmKeys/RequestCreateLlmKeyDTO.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { RequestGetLlmKeyDTO } from "../utils/dtos/llmKeys/RequestGetLlmKeyDTO.js";

export class LlmKeyValidator {
  static async validateRequestCreateLlmKeyDTO(dto: RequestCreateLlmKeyDTO) {
    const schema = z.object({
      title: z.string().nonempty("O título é obrigatório!"),
      key: z.string().nonempty("A chave é obrigatório!"),
      agentId: z.string().nonempty("A identificação do Agente é obrigatória!")
    })

    const response = await schema.safeParseAsync(dto)
    if(!response.success) {
      throw new ValidationError(response.error.issues[0].message)
    }

    return response.data
  }

  static async validateGetLlmKeyDTO(dto: { agentId: string}) {
    const schema = z.object({
      agentId: z.string().nonempty("A identificação do Agente é obrigatória!")
    })

    const response = await schema.safeParseAsync(dto)
    if(!response.success) {
      throw new ValidationError(response.error.issues[0].message)
    }

    return response.data
  }
}