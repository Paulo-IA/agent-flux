import type { ChatHistory } from "../../../types/ChatHistory.js"

export interface ResponseAgentAskDTO {
  response: string
  chatHistory: ChatHistory
}