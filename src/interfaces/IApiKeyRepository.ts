import type { ApiKey } from "../domain/ApiKey.js";
import type { FindUniqueApiKeyQuery } from "../types/apiKey/FindUniqueApiKeyQuery.js";

export interface IApiKeyRepository {
  create(apiKey: ApiKey): Promise<void>
  findMany(by: FindUniqueApiKeyQuery): Promise<ApiKey[]>
}