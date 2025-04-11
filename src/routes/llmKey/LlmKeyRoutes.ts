import type { FastifyInstance } from "fastify";
import { appContianer } from "../../ioc/Container.js";
import type { LlmKeyController } from "../../controllers/LlmKeyController.js";
import { isAuth } from "../../middlewares/IsAuth.js";

export function LlmKeyRoutes(app: FastifyInstance) {
  const llmKeyController: LlmKeyController = appContianer.resolve<LlmKeyController>("LlmKeyController")
    
  app.post("/", { preHandler: isAuth }, llmKeyController.create.bind(llmKeyController))

  app.get("/", { preHandler: isAuth }, llmKeyController.findMany.bind(llmKeyController))
  app.get("/get/:agentId", { preHandler: isAuth }, llmKeyController.getKey.bind(llmKeyController))
}