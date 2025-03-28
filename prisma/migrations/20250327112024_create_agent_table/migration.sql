/*
  Warnings:

  - You are about to drop the column `updatedBy` on the `llm_keys` table. All the data in the column will be lost.
  - You are about to drop the `Memory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[agent_id]` on the table `llm_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agent_id` to the `llm_keys` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "llm_keys" DROP CONSTRAINT "llm_keys_updatedBy_fkey";

-- AlterTable
ALTER TABLE "llm_keys" DROP COLUMN "updatedBy",
ADD COLUMN     "agent_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Memory";

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "temperature" DECIMAL(65,30) NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "memoryUrl" TEXT NOT NULL,
    "memoryType" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "agent_id" TEXT NOT NULL,

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memories_agent_id_key" ON "memories"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "llm_keys_agent_id_key" ON "llm_keys"("agent_id");

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "llm_keys" ADD CONSTRAINT "llm_keys_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
