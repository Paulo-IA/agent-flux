import type { FastifyInstance } from "fastify";
import { UserRoutes } from "./user/UserRoutes.js";
import { AuthRoutes } from "./auth/AuthRoutes.js";
import { AgentRoutes } from "./agents/AgentRoutes.js";
import { LlmKeyRoutes } from "./llmKey/LlmKeyRoutes.js";

export function Routes(app: FastifyInstance) {

  app.register(UserRoutes, { prefix: 'users' })
  app.register(AgentRoutes, { prefix: 'agents' })
  app.register(AuthRoutes, { prefix: 'auth' })
  app.register(LlmKeyRoutes, { prefix: 'llm-keys' })
}