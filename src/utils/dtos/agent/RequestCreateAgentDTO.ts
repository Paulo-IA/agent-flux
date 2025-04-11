export interface RequestCreateAgentDTO {
  name: string
  slug: string
  description: string | undefined
  prompt: string
  model: string
  temperature: number
  maxTokens: number
  userId: string
}