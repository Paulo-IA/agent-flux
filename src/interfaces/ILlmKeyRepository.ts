import type { LlmKey } from "../domain/LlmKey.js";
import type { CreateLlmKeyData } from "../types/llmKey/CreateLlmKeyData.js";
import type { FindUniqueQuery } from "../types/llmKey/FindUniqueQuery.js";

export interface ILlmKeyRepository {
  create(llmKey: LlmKey): Promise<void>
  findUnique(by?: FindUniqueQuery): Promise<LlmKey | null>
  findMany(page: number, take: number): Promise<LlmKey[]>
} 