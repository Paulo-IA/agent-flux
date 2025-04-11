import { container } from "tsyringe";
import { UserPrismaRepository } from "../repositories/UserPrismaRepository.js";
import { UserService } from "../services/UserService.js";
import { UserController } from "../controllers/UserController.js";
import { AgentController } from "../controllers/AgentController.js";
import { AgentService } from "../services/AgentServices.js";
import { AgentImpl } from "../domain/AgentImpl.js";
import { AgentPrismaRepository } from "../repositories/AgentPrismaRepository.js";
import { LlmKeyController } from "../controllers/LlmKeyController.js";
import { LlmKeyService } from "../services/LlmKeyService.js";
import { LlmKeyPrismaRepository } from "../repositories/LlmKeyPrismaRepository.js";
import { CryptoService } from "../services/CryptoService.js";
import { ApiKeyController } from "../controllers/ApiKeyController.js";
import { ApiKeyPrismaRepository } from "../repositories/ApiKeyPrismaRepository.js";
import { ApiKeyService } from "../services/ApiKeyService.js";

container.register("CryptoService", { useClass: CryptoService })

container.register("UserController", { useClass: UserController })
container.register("UserService", { useClass: UserService })
container.register("UserPrismaRepository", { useClass: UserPrismaRepository })

container.register("AgentController", { useClass: AgentController })
container.register("AgentService", { useClass: AgentService })
container.register("AgentPrismaRepository", { useClass: AgentPrismaRepository })
container.register("AgentImpl", { useClass: AgentImpl })

container.register("LlmKeyController", { useClass: LlmKeyController })
container.register("LlmKeyService", { useClass: LlmKeyService })
container.register("LlmKeyPrismaRepository", { useClass: LlmKeyPrismaRepository })

container.register("ApiKeyController", { useClass: ApiKeyController })
container.register("ApiKeyService", { useClass: ApiKeyService })
container.register("ApiKeyPrismaRepository", { useClass: ApiKeyPrismaRepository })

export const appContianer = container