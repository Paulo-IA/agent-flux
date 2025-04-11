import { z } from "zod";
import type { RequestCreateApiKeyDTO } from "../utils/dtos/apiKey/RequestCreateApiKeyDTO.js";
import { ValidationError } from "../errors/ValidationError.js";

export class ApiKeyValidator {
  static async validateRequestCreateApiKeyDTO(dto: RequestCreateApiKeyDTO) {
    const schema = z.object({
      title: z.string().nonempty("O título não pode ser vazio"),
      agentId: z.string().nonempty("O id do cliente é obrigatório")
    })

    const result = await schema.safeParseAsync(dto)
    if(!result.success) {
      throw new ValidationError(result.error.issues[0].message)
    }

    return result.data
  }

}