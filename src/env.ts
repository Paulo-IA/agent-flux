import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().nonempty(),
  PORT: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  NODE_ENV: z.string().nonempty(),
  COOKIE_SECRET: z.string().nonempty(), 
  SAMPLE_KEY: z.string().nonempty(),
  CLOUDFLARE_ENDPOINT: z.string().url(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().nonempty(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().nonempty(),
  CRYPTO_SECRET_KEY: z.string().nonempty(),
  CRYPTO_IV: z.string().nonempty()
})

export const env = envSchema.parse(process.env)