import { z } from "zod";
import type { PaginationDTO } from "../utils/dtos/PaginationDTO.js";
import { ValidationError } from "../errors/ValidationError.js";

export class PaginationValidator {
  static async validatePaginationDTO(dto: PaginationDTO): Promise<PaginationDTO> {
    let { page, take } = { page: Number(dto.page), take: Number(dto.take) }
    
    if (!page) {
      page = 1
    }

    if (!take) {
      take = 5
    }

    const schema = z.object({
      page: z.number().min(0, { message: "Não é possível começar a paginação de um número negativo" }),
      take: z.number().min(0, { message: "Não é possível começar a paginação de um número negativo" }),
    })

    const result = await schema.safeParseAsync({ page, take })
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message)
    }
    
    return result.data
  }
}