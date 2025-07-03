import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
// import { r2 } from "../../lib/cloudflare.js";
// import { env } from "../../env.js";

const SOURCE_CSV_URL = "https://pub-56edb005846c42279165d18761db2da6.r2.dev/faq.csv";
const OUTPUT_FILENAME = "vectors-bia.json";
const R2_BUCKET_NAME = "agent-flux-dev";

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!
  }
})

async function generateAndUploadVectors() {
  console.log("1. Baixando o CSV da Cloudflare R2...");
  const response = await fetch(SOURCE_CSV_URL);
  if (!response.ok) throw new Error("Falha ao baixar o CSV.");
  const csvBlob = await response.blob();

  console.log("2. Carregando e dividindo o documento...");
  const loader = new CSVLoader(csvBlob);
  const docs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 300, chunkOverlap: 30 });
  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`   Documento dividido em ${splitDocs.length} chunks.`);

  console.log("3. Gerando embeddings (chamando a API da OpenAI)...");
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
  const tempVectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  console.log("   Embeddings gerados.");

  console.log("4. Preparando o arquivo JSON para upload...");
  const vectorsToSave = tempVectorStore.memoryVectors;
  const jsonBody = JSON.stringify(vectorsToSave);

  console.log(`5. Fazendo upload de '${OUTPUT_FILENAME}' para o bucket '${R2_BUCKET_NAME}'...`);
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: OUTPUT_FILENAME,
      Body: jsonBody,
      ContentType: "application/json",
    })
  );

  console.log("✅ Processo concluído com sucesso!");
  console.log(`Acesse seu arquivo de vetores em: https://pub-....r2.dev/${OUTPUT_FILENAME}`);
}

generateAndUploadVectors().catch(console.error);