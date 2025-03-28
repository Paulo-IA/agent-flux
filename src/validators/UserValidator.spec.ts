import { ValidationError } from "../errors/ValidationError.js"
import { UserValidator } from "./UserValidator.js"

describe('UserValidator', () => {
  it("should be able to validate a correct Create User Request DTO", async () => {
    const requestUserDto = {
      name: "Paulo Fernandes",
      email: "paulor.exe@gmail.com",
      password: "123465"
    }
    const result = await UserValidator.validateCreateUserDto(requestUserDto)
    expect(result).toEqual(requestUserDto)
  })

  it("should throw ValidationError for empty name", async () => {
    const requestUserDto = {
      name: "",
      email: "paulor.exe@gmail.com",
      password: "123465"
    }
    
    expect(UserValidator.validateCreateUserDto(requestUserDto)).rejects.toThrow(
      new ValidationError("O nome é obrigatório.")
    )
  })

  it("should throw ValidationError for invalid email", async () => {
    const requestUserDto = {
      name: "Paulo Fernandes",
      email: "paulor.exe@",
      password: "123465"
    }
    
    expect(UserValidator.validateCreateUserDto(requestUserDto)).rejects.toThrow(
      new ValidationError("E-mail incorreto")
    )
  })

  it("should throw ValidationError for empty email", async () => {
    const requestUserDto = {
      name: "Paulo Fernandes",
      email: "",
      password: "123465"
    }
    
    expect(UserValidator.validateCreateUserDto(requestUserDto)).rejects.toThrow(
      new ValidationError("O e-mail é obrigatório.")
    )
  })

  it("should throw ValidationError for empty password", async () => {
    const requestUserDto = {
      name: "Paulo Fernandes",
      email: "paulor.exe@gmail.com",
      password: ""
    }
    
    expect(UserValidator.validateCreateUserDto(requestUserDto)).rejects.toThrow(
      new ValidationError("A senha é obrigatória.")
    )
  })
})