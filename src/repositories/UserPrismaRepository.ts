import { PrismaClient } from "@prisma/client";
import type { IUserRepository } from "../interfaces/IUserRepository.js";
import { User } from "../domain/User.js";
import type { RequestFindManyUsersDTO } from "../utils/dtos/user/requestFindManyUsersDTO.js";

export class UserPrismaRepository implements IUserRepository {
  constructor(
    readonly prisma: PrismaClient = new PrismaClient()
  ) {}

  async create(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        name: user.getName(),
        email: user.getEmail(),
        password: user.getPassword()
      }
    })
  }
  
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (user === null) {
      return user
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    )
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (user === null) {
      return user
    }

    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    )
  }

  async findMany({ page, take }: RequestFindManyUsersDTO): Promise<User[]> {
    const foundUsers = await this.prisma.user.findMany({
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        name: 'asc'
      }
    })
    const users = foundUsers.map(user => new User(user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt))

    return users
  }
}