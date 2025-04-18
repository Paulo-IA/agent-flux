import type { User } from "../domain/User.js";
import type { RequestFindManyUsersDTO } from "../utils/dtos/user/requestFindManyUsersDTO.js";

export interface IUserRepository {
  create(user: User): Promise<void>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>

  findByEmailOrSlug({ email, slug }: { email?: string, slug?: string}): Promise<User | null>

  findBySlug(slug: string): Promise<User | null>

  findUnique(uniqueId: string): Promise<User | null>

  findMany({ page, take }: RequestFindManyUsersDTO): Promise<User[]>
}