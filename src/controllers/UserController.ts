import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserService } from "../services/UserService.js";
import { RequestCreateUserDto } from "../utils/dtos/user/RequestCreateUserDto.js";
import { inject, injectable } from "tsyringe";
import type { RequestLoginUserDto } from "../utils/dtos/auth/RequestLoginUserDto.js";
import { getUserFromRequest } from "../utils/getUserFromRequest.js";
import { NODE_ENV } from "../utils/env.js";

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