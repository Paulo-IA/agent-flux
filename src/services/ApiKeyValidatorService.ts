import { inject, injectable } from "tsyringe";
import type { ApiKeyService } from "./ApiKeyService.js";
import type { ResponseValidateApiKey } from "../types/apiKey/keyValidator/ResponseValidateApiKey.js";

@injectable()
export class ApiKeyValidatorService {
  constructor(
    @inject("ApiKeyService") private readonly apiKeyService: ApiKeyService
  ) {}

  async validateApiKey(reqKey: string): Promise<ResponseValidateApiKey> {
    return await this.apiKeyService.validate(reqKey)
  }
}