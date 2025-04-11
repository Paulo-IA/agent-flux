export interface ResponseDetailedAgent {
  id: string
  name: string
  slug: string
  description: string
  prompt: string
  model: string
  temperature: number
  maxTokens: number
  createdAt: Date
  updatedAt: Date
}