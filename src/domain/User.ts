export class User {
  private id: string;
  private name: string;
  private email: string;
  private password: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, name: string, email: string, password: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  getId(): string {
    return this.id
  }

  getName(): string {
    return this.name
  }

  getEmail(): string {
    return this.email
  }

  getPassword(): string {
    return this.password
  }

  setPassword(password: string): void {
    this.password = password
  }

  getCreatedAt(): Date {
    return this.createdAt
  }
}