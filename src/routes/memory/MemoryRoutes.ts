import type { FastifyInstance } from "fastify";
import { appContianer } from "../../ioc/Container.js";
import { isAuth } from "../../middlewares/IsAuth.js";
import type { MemoryController } from "../../controllers/MemoryController.js";

export function MemoryRoutes(app: FastifyInstance) {
  const memoryController: MemoryController = appContianer.resolve<MemoryController>("MemoryController")
    
    app.post('/donwload', { preHandler: isAuth }, memoryController.donwload.bind(memoryController))
}