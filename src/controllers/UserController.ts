import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "../services/UserService.js";
import { RequestCreateUserDto } from "../utils/dtos/user/RequestCreateUserDto.js";
import { inject, injectable } from "tsyringe";
import type { RequestLoginUserDto } from "../utils/dtos/auth/RequestLoginUserDto.js";
import { getUserFromRequest } from "../utils/getUserFromRequest.js";
import type { RequestFindManyUsersDTO } from "../utils/dtos/user/requestFindManyUsersDTO.js";
@injectable()
export class UserController { 
  constructor (
    @inject("UserService") readonly userService: UserService
  ) { }

  async create(req: FastifyRequest, reply: FastifyReply) {
    const user = getUserFromRequest(req)
    console.log(user)

    const createUserDto: RequestCreateUserDto = req.body as RequestCreateUserDto

    await this.userService.create(createUserDto)

    return reply.status(201).send()
  }

  async findMany(req: FastifyRequest, reply: FastifyReply) {
    const findManyUsersDTO = req.query as RequestFindManyUsersDTO

    const users = await this.userService.findMany(findManyUsersDTO)

    if (users.users.length === 0) {
      return reply.code(204).send()
    }

    return reply.send(users)
  }

  async findUnique(req: FastifyRequest, reply: FastifyReply) {
    // Implement slug
    // const findUniqueDto = req.params

    // const user = await this.userService.findUnique()

    // return user
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const loginUserDto: RequestLoginUserDto = req.body as RequestLoginUserDto

    const token = await this.userService.login(loginUserDto)
    
    return reply.send({ token })
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("user", { path: "/" });
    return reply.send({ message: "Logout bem-sucedido" });
  }
}