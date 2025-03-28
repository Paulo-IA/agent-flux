import type { AIMessage, HumanMessage } from "@langchain/core/messages";

export type LangchainChatHistory = (HumanMessage | AIMessage)[]