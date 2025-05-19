import "reflect-metadata"
import Fastify from 'fastify'
import { Routes } from '../routes/Routes.js'
import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import fastifyCookie from "@fastify/cookie"
import { env } from "../env.js"

import cors from '@fastify/cors'

const app = Fastify()
await app.register(cors, {
  origin: '*',
  methods: ['POST', 'PUT', 'GET']
})

ErrorHandler(app)

app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET,
});

app.register(Routes)

app.listen({ port: Number(env.PORT), host: '0.0.0.0' }, function (err, address) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server Running on port ${env.PORT}! 🚀`)
})