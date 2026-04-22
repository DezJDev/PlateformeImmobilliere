-- DropIndex
DROP INDEX "public"."Question_authorId_idx";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answer" TEXT,
ADD COLUMN     "answerAuthorId" INTEGER,
ADD COLUMN     "answeredAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_answerAuthorId_fkey" FOREIGN KEY ("answerAuthorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
