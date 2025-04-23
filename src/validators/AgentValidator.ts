import { z } from "zod";
import type { RequestCreateAgentDTO } from "../utils/dtos/agent/RequestCreateAgentDTO.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { RequestFindManyAgentsDTO } from "../utils/dtos/agent/RequestFindManyAgentsDTO.js";
import type { RequestFindUniqueAgentDTO } from "../utils/dtos/agent/RequestFindUniqueAgentDTO.js";
import type { RequestUpdateAgentDTO } from "../utils/dtos/agent/RequestUpdateAgentDTO.js";

export class AgentValidator {
  static async validateRequestCreateAgentDTO(requestCreateAgentDTO: RequestCreateAgentDTO) {
    const schema = z.object({
      name: z.string().nonempty("O nome não pode ser vazio!"),
      slug: z.string().nonempty("O slug não pode ser vazio!"),
      description: z.optional(z.string()),
      prompt: z.string().nonempty("O prompt não pode ser vazio!"),
      model: z.optional(z.string()),
      temperature: z.optional(z.number()),
      maxTokens: z.optional(z.number()),
      userId: z.string().nonempty("Token Inválido!")
    })

    const result = await schema.safeParseAsync(requestCreateAgentDTO)
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message);
    }

    return result.data
  }

  static async validateRequestFindManyAgentDTO(requestFindManyAgentsDTO: RequestFindManyAgentsDTO) {
    requestFindManyAgentsDTO = { page: Number(requestFindManyAgentsDTO.page), take: Number(requestFindManyAgentsDTO.take) }

    if (!requestFindManyAgentsDTO.page) {
      requestFindManyAgentsDTO.page = 1
    }

    if (!requestFindManyAgentsDTO.take) {
      requestFindManyAgentsDTO.take = 5
    }

    const schema = z.object({
      page: z.number().min(0, { message: "Não é possível começar a paginação de um número negativo" }),
      take: z.number().min(0, { message: "Não é possível começar a paginação de um número negativo" }),
    })

    const result = await schema.safeParseAsync(requestFindManyAgentsDTO)
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message)
    }
    
    return result.data
  }

  static async validateRequestFindUniqueDTO(requestFindUniqueAgentDTO: RequestFindUniqueAgentDTO) {
    const schema = z.object({
      uniqueId: z.string({
        message: "O identificador deve ser um texto!"
      }).nonempty("Preencha o valor do Id único!")
    })

    const response = await schema.safeParseAsync(requestFindUniqueAgentDTO)
    if(!response.success) {
      throw new ValidationError(response.error.issues[0].message)
    }

    return response.data
  }

  static async validateRequestUpdateDTO(dto: RequestUpdateAgentDTO) {
    const schema = z.object({
      id: z.string().nonempty("Nenhum identificador encontrado!"),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      prompt: z.string().optional(),
      model: z.string().optional(),
      temperature: z.string().optional(),
    })

    const res = await schema.safeParseAsync(dto)
    if (!res.success) {
      throw new ValidationError(res.error.issues[0].message)
    }

    return res.data
  }
}