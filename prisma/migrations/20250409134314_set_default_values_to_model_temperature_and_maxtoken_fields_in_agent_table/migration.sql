/*
  Warnings:

  - Made the column `model` on table `agents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `temperature` on table `agents` required. This step will fail if there are existing NULL values in that column.
  - Made the column `maxTokens` on table `agents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "agents" ALTER COLUMN "model" SET NOT NULL,
ALTER COLUMN "model" SET DEFAULT 'gpt-3.5-turbo',
ALTER COLUMN "temperature" SET NOT NULL,
ALTER COLUMN "temperature" SET DEFAULT 0.7,
ALTER COLUMN "maxTokens" SET NOT NULL,
ALTER COLUMN "maxTokens" SET DEFAULT 150;
