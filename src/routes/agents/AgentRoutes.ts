import type { FastifyInstance } from "fastify";
import { appContianer } from "../../ioc/Container.js";
import type { AgentController } from "../../controllers/AgentController.js";
import { ApiKeyAuth } from "../../middlewares/ApiKeyAuth.js";

export async function AgentRoutes(app: FastifyInstance) {
  const agentController: AgentController = appContianer.resolve<AgentController>("AgentController")
 
  app.post("/:id/ask", { preHandler: ApiKeyAuth }, agentController.ask.bind(agentController))
}