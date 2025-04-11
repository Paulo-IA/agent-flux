export class ApiKey {
  private id: string
  private title: string
  private key: string
  private agentId: string
  private createdAt: Date
  private updatedAt: Date

  constructor(id: string, title: string, key: string, agentId: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.title = title
    this.key = key
    this.agentId = agentId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  getId(): string {
    return this.id
  }

  getTitle(): string {
    return this.title
  }

  getKey(): string {
    return this.key
  }

  getOcultKey(): string {
    return 'oculted'
  }

  getAgentId(): string {
    return this.agentId
  }

  getCreatedAt(): Date {
    return this.createdAt
  }

  getUpdatedAt(): Date {
    return this.updatedAt
  }
}