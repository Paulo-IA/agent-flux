export type ChatMessage = {
  role: "developer" | "user" | "assistant"
  content: string
}