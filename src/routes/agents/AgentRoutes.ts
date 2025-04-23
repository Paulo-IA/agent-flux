import type { FastifyInstance } from "fastify";
import { appContianer } from "../../ioc/Container.js";
import type { AgentController } from "../../controllers/AgentController.js";
import { ApiKeyAuth } from "../../middlewares/ApiKeyAuth.js";
import { isAuth } from "../../middlewares/IsAuth.js";

export async function AgentRoutes(app: FastifyInstance) {
  const agentController: AgentController = appContianer.resolve<AgentController>("AgentController")
 
  app.post("/", { preHandler: isAuth}, agentController.create.bind(agentController))
  app.post("/ask", { preHandler: ApiKeyAuth }, agentController.ask.bind(agentController))

  app.get("/", { preHandler: isAuth }, agentController.findMany.bind(agentController))
  app.get("/:uniqueId", { preHandler: isAuth }, agentController.findUnique.bind(agentController))

  app.put("/:id", { preHandler: isAuth }, agentController.update.bind(agentController))
}