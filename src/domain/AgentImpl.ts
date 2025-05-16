import { inject, injectable } from "tsyringe";
import type { IAgent } from "../interfaces/IAgent.js";
import type { QuestionInfos } from "../types/QuestionInfos.js";
import { Agent } from "../utils/agent/Agent.js";
import { Agent as AgentDomain } from "../domain/Agent.js"
import { z } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
import type { ICryptography } from "../interfaces/ICryptography.js";
import path from "node:path";
import fs from "node:fs/promises"
import type { LlmKeyService } from "../services/LlmKeyService.js";

@injectable()
export class AgentImpl implements IAgent {
  constructor(
    @inject("CryptoService") readonly cryptographyService: ICryptography,
    @inject("LlmKeyService") readonly llmKeyService: LlmKeyService
  ) {}

  // private pathToMemory: string = import.meta.dirname.split('domain')[0] + "public/iris_memory.csv"
  private pathToMemory: string = "https://pub-56edb005846c42279165d18761db2da6.r2.dev/faq.csv"
  // private pathToMemory: string = "https://pub-56edb005846c42279165d18761db2da6.r2.dev/iris_memory.csv"

  async ask(agentDomain: AgentDomain, questionInfos: QuestionInfos): Promise<string> {
    const { question, chatHistory } = questionInfos
    
    // Validate properties (AgentValidator??)
    const schema = z.object({
      llmKey: z.string().nonempty("A chave de API não pode ser vazia"),
      prompt: z.string().nonempty("O prompt não pode ser vazio")
    })

    const llmKey = await this.llmKeyService.getKey(agentDomain.getId())

    // get file and path
    const resp = await fetch(this.pathToMemory);
    if (!resp.ok) {
      throw new Error(`Erro HTTP: ${resp.status}`);
    }

    const __dirname = import.meta.dirname.split('domain')[0]
    const filename = `${new Date()}-${agentDomain.getId()}-memory.csv`
    const buffer = await resp.arrayBuffer();
    const filePath = path.join(__dirname, "downloads", filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, Buffer.from(buffer));
    // get file and path

    const res = await schema.safeParseAsync({
      llmKey: llmKey.key,
      prompt: agentDomain.getPrompt()
    })
    if(!res.success) {
      throw new ValidationError(res.error.issues[0].message)
    }
    // Validation end

    const agent = new Agent(llmKey.key, agentDomain.getPrompt(), filePath)

    const { response } = await agent.ask(question, chatHistory)

    await fs.unlink(filePath)
    console.log("Removido")

    return response
  }
}