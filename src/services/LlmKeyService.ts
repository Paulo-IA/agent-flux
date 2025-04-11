import { inject, injectable } from "tsyringe";
import type { ILlmKeyRepository } from "../interfaces/ILlmKeyRepository.js";
import type { RequestCreateLlmKeyDTO } from "../utils/dtos/llmKeys/RequestCreateLlmKeyDTO.js";
import { LlmKeyValidator } from "../validators/LlmKeyValidator.js";
import type { IAgentRepository } from "../interfaces/IAgentRepository.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import bcrypt from "bcrypt"
import { LlmKeyMapper } from "../utils/mappers/LlmKeyMapper.js";
import type { PaginationDTO } from "../utils/dtos/PaginationDTO.js";
import { PaginationValidator } from "../validators/PaginationValidator.js";
import type { RequestGetLlmKeyDTO } from "../utils/dtos/llmKeys/RequestGetLlmKeyDTO.js";
import type { ICryptography } from "../interfaces/ICryptography.js";

@injectable()
export class LlmKeyService {
  constructor(
    @inject("LlmKeyPrismaRepository") readonly llmKeyRepository: ILlmKeyRepository,
    @inject("AgentPrismaRepository") readonly agentRepository: IAgentRepository,
    @inject("CryptoService") readonly cryptographyService: ICryptography
  ) {}

  // Services
  
  // Create Service
  async create(dto: RequestCreateLlmKeyDTO) {
    await LlmKeyValidator.validateRequestCreateLlmKeyDTO(dto)
    const llmKey = LlmKeyMapper.requestCreateDtoToEntity(dto)
    
    // Valida se agente existe
    const agent = await this.agentRepository.findUnique({ by: { id: llmKey.getAgentId() } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!")
    }

    // Valida se o agente já tem uma chave cadastrada
    const foundLlmKey = await this.llmKeyRepository.findUnique({ by: { agentId: llmKey.getAgentId() } })
    if (foundLlmKey !== null) {
      throw new NotFoundError("O Agente já tem uma chave cadastrada!")
    }

    // Encripta a chave
    const encryptedKey = this.cryptographyService.encrypt(llmKey.getKey())
    llmKey.setKey(encryptedKey)

    await this.llmKeyRepository.create(llmKey)
  }

  // Find Many Service
  async findMany(dto: PaginationDTO) {
    const { page, take } = await PaginationValidator.validatePaginationDTO(dto)

    const llmKeys = await this.llmKeyRepository.findMany(page, take)

    return llmKeys.map(llmKey => {
      const decryptedKey = this.cryptographyService.decrypt(llmKey.getKey())
      llmKey.setKey(decryptedKey)
      
      return LlmKeyMapper.entityToResponseDTO(llmKey)
    })
  }

  // Get Key Service
  async getKey(dto: RequestGetLlmKeyDTO) {
    const { agentId } = await LlmKeyValidator.validateGetLlmKeyDTO(dto)

    // verificar se agente existe
    const agent = await this.agentRepository.findUnique({ by: { id: agentId } })
    if (agent === null) {
      throw new NotFoundError("Agente não encontrado!");
    }

    // buscar chave por id
    const llmKey = await this.llmKeyRepository.findUnique({ by: { agentId } })
    if (llmKey === null) {
      throw new NotFoundError("Nenhuma chave de LLM encontrada para este agente!");
    }

    // responder com a chave e id
    const decryptedKey = this.cryptographyService.decrypt(llmKey.getKey())

    return {
      id: llmKey.getId(),
      key: decryptedKey
    }
  }
}