/*
  Warnings:

  - You are about to drop the column `user_id` on the `api_keys` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_fkey";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
