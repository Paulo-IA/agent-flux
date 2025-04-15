import type { ChatHistory } from "../../../types/ChatHistory.js"

export interface RequestAgentAskDTO {
  question: string
  chatHistory: ChatHistory
  agentId: string
}