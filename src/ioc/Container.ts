import { container } from "tsyringe";
import { UserPrismaRepository } from "../repositories/UserPrismaRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";
import { AgentController } from "../controllers/AgentController.js";
import { AgentService } from "../services/AgentServices.js";
import { AgentImpl } from "../domain/AgentImpl.js";
import { AgentPrismaRepository } from "../repositories/AgentPrismaRepository.js";

container.register("UserController", { useClass: UserController })
container.register("UserService", { useClass: UserService })
container.register("UserPrismaRepository", { useClass: UserPrismaRepository })

container.register("AgentController", { useClass: AgentController })
container.register("AgentService", { useClass: AgentService })
container.register("AgentPrismaRepository", { useClass: AgentPrismaRepository })

container.register("AgentImpl", { useClass: AgentImpl })

export const appContianer = container