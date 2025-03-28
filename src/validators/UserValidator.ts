import { z } from "zod";
import type { RequestCreateUserDto } from "../utils/dtos/user/RequestCreateUserDto.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { RequestLoginUserDto } from "../utils/dtos/auth/RequestLoginUserDto.js";

export class UserValidator {
  static async validateCreateUserDto(createUserDto: RequestCreateUserDto) {
    const schema = z.object({
      name: z.string().nonempty({ message: "O nome é obrigatório." }),
      email: z.string().nonempty({ message: "O e-mail é obrigatório." }).email({ message: "E-mail incorreto"}),
      password: z.string().nonempty({ message: "A senha é obrigatória." })
    })

    const result = await schema.safeParseAsync(createUserDto)
    if (!result.success) {
      throw new ValidationError(result.error.issues[0].message)
    }

    return result.data
  }

  static async validateLoginUserDto(loginUserDto: RequestLoginUserDto) {
    const schema = z.object({
      email: z.string().nonempty({ message: "O e-mail é obrigatório." }).email({ message: "E-mail incorreto"}),
      password: z.string().nonempty({ message: "A senha é obrigatória." })
    })

    const result = await schema.safeParseAsync(loginUserDto)
    if(!result.success) {
      throw new ValidationError(result.error.issues[0].message)
    }

    return result
  }
}