import { container } from "tsyringe";
import { UserPrismaRepository } from "../repositories/UserPrismaRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";
import { AgentController } from "../controllers/AgentController.js";
import { AgentService } from "../services/AgentServices.js";
import { AgentImpl } from "../domain/AgentImpl.js";

container.register("UserPrismaRepository", { useClass: UserPrismaRepository })

container.register("UserService", { useClass: UserService })
container.register("UserController", { useClass: UserController })

container.register("AgentController", { useClass: AgentController })
container.register("AgentService", { useClass: AgentService })

container.register("AgentImpl", { useClass: AgentImpl })

export const appContianer = container