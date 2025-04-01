export class User {
  private id: string;
  private name: string;
  private slug: string;
  private email: string;
  private password: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, name: string, slug: string, email: string, password: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.name = name
    this.slug = slug
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

  getSlug(): string {
    return this.slug
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