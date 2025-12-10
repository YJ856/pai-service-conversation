/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Answer` table. All the data in the column will be lost.
  - You are about to alter the column `questionOrder` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropIndex
DROP INDEX "conversation"."Answer_questionId_key";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("questionId");

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "questionOrder" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE INDEX "Question_conversationId_questionOrder_idx" ON "Question"("conversationId", "questionOrder");
