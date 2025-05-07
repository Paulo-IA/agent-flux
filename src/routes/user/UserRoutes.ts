import type { FastifyInstance } from "fastify";
import type { UserController } from "../../controllers/UserController.js";
import { appContianer } from "../../ioc/Container.js";
import { isAuth } from "../../middlewares/IsAuth.js";


export function UserRoutes(app: FastifyInstance) {
  const userController: UserController = appContianer.resolve<UserController>("UserController")
  
  app.post('/', userController.create.bind(userController))
  app.get('/', { preHandler: isAuth }, userController.findMany.bind(userController))
  app.get('/:uniqueId', { preHandler: isAuth }, userController.findUnique.bind(userController))
}