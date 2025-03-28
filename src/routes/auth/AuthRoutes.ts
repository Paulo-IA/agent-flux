import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { UserController } from "../../controllers/UserController.js";
import { appContianer } from "../../ioc/Container.js";

export function AuthRoutes(app: FastifyInstance) {
  const userController: UserController = appContianer.resolve("UserController")

  app.post('/login', userController.login.bind(userController))
  app.post('/logout', userController.logout.bind(userController))
}