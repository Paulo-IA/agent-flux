import type { ApiKey } from "./ApiKey.js"
import type { LlmKey } from "./LlmKey.js"
import type { Memory } from "./Memory.js"

export class Agent {
  private id: string
  private name: string
  private slug: string
  private description: string
  private prompt: string
  private model: string
  private temperature: number
  private maxTokens: number
  private apiKeys: ApiKey[] | undefined
  private llmKey: LlmKey | undefined
  private memory: Memory | undefined
  private userId: string

  private createdAt: Date
  private updatedAt: Date

  constructor(
    id: string,
    name: string,
    slug: string,
    description: string,
    prompt: string,
    model: string ,
    temperature: number ,
    maxTokens: number ,
    apiKeys: ApiKey[] | undefined,
    llmKey: LlmKey | undefined,
    memory: Memory | undefined,
    userId: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.name = name
    this.slug = slug
    this.description = description
    this.prompt = prompt
    this.model = model
    this.temperature = temperature
    this.maxTokens = maxTokens
    this.apiKeys = apiKeys
    this.llmKey = llmKey
    this.memory = memory
    this.userId = userId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  setName(name: string): void {
    this.name = name
  }

  getSlug(): string {
    return this.slug
  }

  setSlug(slug: string): void {
    this.slug = slug
  }
  
  getDescription(): string  {
    return this.description
  }

  setDescription(description: string): void {
    this.description = description
  }
  
  getPrompt(): string {
    return this.prompt
  }

  setPrompt(prompt: string): void {
    this.prompt = prompt
  }
  
  getModel(): string  {
    return this.model
  }

  setModel(model: string): void {
    this.model = model
  }

  getTemperature(): number  {
    return this.temperature
  }

  setTemperature(temperature: number): void {
    this.temperature = temperature
  }
  
  getMaxTokens(): number {
    return this.maxTokens
  }

  getApiKeys(): ApiKey[] | undefined {
    return this.apiKeys
  }

  setApiKeys(apiKeys: ApiKey[]): void {
    this.apiKeys = apiKeys
  }
  
  getLlmKey(): LlmKey | undefined {
    return this.llmKey
  }

  getMemory(): Memory | undefined {
    return this.memory
  }

  getUserId(): string {
    return this.userId
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }
}