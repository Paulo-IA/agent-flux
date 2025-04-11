import type { FastifyInstance } from "fastify";
import type { ApiKeyController } from "../../controllers/ApiKeyController.js";
import { appContianer } from "../../ioc/Container.js";
import { isAuth } from "../../middlewares/IsAuth.js";

export function ApiKeyRoutes(app: FastifyInstance) {
  const apiKeyContoller: ApiKeyController = appContianer.resolve<ApiKeyController>("ApiKeyController")
    
  app.post('/:agentId', { preHandler: isAuth }, apiKeyContoller.create.bind(apiKeyContoller))
}