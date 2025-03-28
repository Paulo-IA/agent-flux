import type { FastifyInstance } from "fastify";
import { UserRoutes } from "./user/UserRoutes.js";
import { AuthRoutes } from "./auth/AuthRoutes.js";

export function Routes(app: FastifyInstance) {

  app.register(UserRoutes, { prefix: 'users' })
  app.register(AuthRoutes, { prefix: 'auth' })
}