import type { ApiKey } from "../domain/ApiKey.js";

export interface IApiKeyRepository {
  create(apiKey: ApiKey): Promise<void>
}