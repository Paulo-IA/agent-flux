import "reflect-metadata"
import Fastify from 'fastify'
import { COOKIE_SECRET, PORT } from '../utils/env.js'
import { Routes } from '../routes/Routes.js'
import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import fastifyCookie from "@fastify/cookie"

const app = Fastify()

ErrorHandler(app)

app.register(fastifyCookie, {
  secret: COOKIE_SECRET,
});

app.register(Routes)

app.listen({ port: Number(PORT), host: '0.0.0.0' }, function (err, address) {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Server Running on port ${PORT}! 🚀`)
})