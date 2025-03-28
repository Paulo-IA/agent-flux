import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().nonempty(),
  PORT: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  NODE_ENV: z.string().nonempty(),
  COOKIE_SECRET: z.string().nonempty(), 
  SAMPLE_KEY: z.string().nonempty()
})

const parsedSchema = envSchema.parse(process.env)

console.log(process.env.OPENAI_API_KEY)

export const {
  OPENAI_API_KEY,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  COOKIE_SECRET,
  SAMPLE_KEY
} = parsedSchema

// export const {
//   OPENAI_API_KEY,
//   PORT,
//   JWT_SECRET,
//   NODE_ENV,
//   COOKIE_SECRET,
//   SAMPLE_KEY
// } = process.env