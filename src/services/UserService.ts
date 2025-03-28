import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type { RequestCreateUserDto } from "../utils/dtos/user/RequestCreateUserDto.js";
import { UserValidator } from "../validators/UserValidator.js";
import { UserMapper } from "../utils/mappers/UserMapper.js";
import { ConflictError } from "../errors/ConflictError.js";
import bcrypt from "bcrypt"
import type { RequestLoginUserDto } from "../utils/dtos/auth/RequestLoginUserDto.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken"
import { env } from "../env.js";
import type { RequestFindManyUsersDTO } from "../utils/dtos/user/requestFindManyUsersDTO.js";

@injectable()
export class UserService {
  private SALT_ROUNDS = 10

  constructor (
    @inject("UserPrismaRepository") readonly userRepository: IUserRepository
  ) {}
  
  async create(createUserDto: RequestCreateUserDto) {
    await UserValidator.validateCreateUserDto(createUserDto)
    const user = UserMapper.requestDtoToEntity(createUserDto)

    const userFound = await this.userRepository.findByEmail(user.getEmail())
    if (userFound !== null) {
      throw new ConflictError("E-mail já cadastrado!")
    }
    
    const hashedPassword = await bcrypt.hash(user.getPassword(), this.SALT_ROUNDS)
    user.setPassword(hashedPassword)

    await this.userRepository.create(user)
  }

  async findMany(requestFindManyUsersDTO: RequestFindManyUsersDTO) {
    let { page, take } = await UserValidator.validateFindManyDTO(requestFindManyUsersDTO)

    const foundUsers = await this.userRepository.findMany({ page, take })

    const users = foundUsers.map(user => UserMapper.entityToResponseDto(user))

    return { users }
  }

  async findUnique(id: string) {
    const user = await this.userRepository.findById(id)
    if (user === null) {
      throw new NotFoundError("Usuário não encontrado")
    }

    return UserMapper.entityToResponseDto(user)
  }

  async login(loginUserDto: RequestLoginUserDto) {
    await UserValidator.validateLoginUserDto(loginUserDto)
    
    const user = await this.userRepository.findByEmail(loginUserDto.email)
    if (user === null) {
      throw new NotFoundError("Usuário não Encontrado!")
    }

    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.getPassword())
    if (!passwordMatch) {
      throw new UnauthorizedError("Credenciais Incorretas!")
    }

    const token = jwt.sign({ id: user.getId(), email: user.getEmail() }, env.JWT_SECRET, { expiresIn: "1h" })

    return token
  }
}