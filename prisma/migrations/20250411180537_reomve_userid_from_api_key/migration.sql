/*
  Warnings:

  - You are about to drop the column `userId` on the `api_keys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_userId_fkey";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "userId";
