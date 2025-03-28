import type { User } from "../domain/User.js";

export interface IUserRepository {
  create(user: User): Promise<void>

  findById(id: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>
}