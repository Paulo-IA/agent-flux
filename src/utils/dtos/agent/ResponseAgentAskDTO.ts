import type { ChatHistory } from "../../../types/ChatHistory.js"
import type { ChatMessage } from "../../../types/ChatMessage.js"

export interface ResponseAgentAskDTO {
  response: string
  chatHistory: ChatHistory
}