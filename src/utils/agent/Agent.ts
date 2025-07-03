import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import type { LangchainChatHistory } from "./types/LangchainChatHistory.js";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import type { ChatHistory } from "../../types/ChatHistory.js";
import type { Runnable } from "@langchain/core/runnables";

type SavedVector = {
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
};

export class Agent {
  private llmApiKey: string
  private prompt: string

  private chain: Runnable | null = null;

  constructor(llmApiKey: string, prompt: string) {
    this.llmApiKey = llmApiKey
    this.prompt = prompt
    // this.memoryPath = memoryPath
  }

  async ask(question: string, requestChatHistory: ChatHistory, savedVectors: SavedVector[]) {
    const chain = await this.getChain(savedVectors)

    const chatHistory = this.mapHistory(requestChatHistory)

    const chainResponse = await chain.invoke({
      input: question,
      chat_history: chatHistory
    })

    const response = {
      response: chainResponse.answer
    }

    return response
  }

  private async getChain(savedVectors: SavedVector[]) {
    if (this.chain) {
      console.log("Reutilizando a chain existente...");
      return this.chain;
    }

    const vectorStore = await this.createVectorStore(savedVectors)
    const newChain = await this.createChain(vectorStore)

    this.chain = newChain
    return this.chain
  }

  private mapHistory(requestChatHistory: ChatHistory): LangchainChatHistory {
    return requestChatHistory.map(chatMessage => {
      const { role, content } = chatMessage
      
      if (role === "assistant") return new AIMessage(content)
      
        return new HumanMessage(content)
    })
  }

  private async createVectorStore(savedVectors: SavedVector[]): Promise<MemoryVectorStore> {

    const embeddings = new OpenAIEmbeddings({ openAIApiKey: this.llmApiKey });

    const vectorStore = new MemoryVectorStore(embeddings);

    await vectorStore.addVectors(
      savedVectors.map((v) => v.embedding),
      savedVectors.map((v) => ({
        pageContent: v.content,
        metadata: v.metadata,
      }))
    );
    
    return vectorStore;
  }

  // private async createVectorStore() {
  //   const loader = new CSVLoader(this.memoryPath)
  //   const docs = await loader.load()
    
  //   const splitter = new RecursiveCharacterTextSplitter({
  //     chunkSize: 300,
  //     chunkOverlap: 30
  //   })
    
  //   const splitDocs = await splitter.splitDocuments(docs)
    
  //   const embeddings = new OpenAIEmbeddings({ openAIApiKey: this.llmApiKey, verbose: true })
    
  //   // Trocar
  //   const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings)
  
  //   return vectorStore
  // }

  private async createChain(vectorStore: MemoryVectorStore) {    
    const model = new ChatOpenAI({
      openAIApiKey: this.llmApiKey,
      temperature: 0.7,
      model: "gpt-4o-mini",
      maxRetries: 5
    })
    
    const prompt = ChatPromptTemplate.fromMessages([
      ["developer", `
        <Contexto>
          ${this.prompt}
        
          {context} 
        </Contexto>
      `],
      new MessagesPlaceholder("chat_history"),
      ["human", "Pergunta: {input}"]
    ])
    
    const chain = await createStuffDocumentsChain({
      llm: model,
      prompt
    })
  
    const retriever = vectorStore.asRetriever({
      k: 3
    })
  
    const retrieverPrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user", 
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation"
      ]
    ])
  
    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm: model,
      retriever,
      rephrasePrompt: retrieverPrompt,
    })
    
    const conversationChain = await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: chain
    })
  
    return conversationChain
  }
}