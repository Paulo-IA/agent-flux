import { container } from "tsyringe";
import { UserPrismaRepository } from "../repositories/UserPrismaRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";

container.register("UserPrismaRepository", { useClass: UserPrismaRepository })

container.register("UserService", { useClass: UserService })
container.register("UserController", { useClass: UserController })

export const appContianer = container