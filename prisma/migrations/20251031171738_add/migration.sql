-- DropIndex
DROP INDEX "public"."Question_annonceId_idx";

-- CreateIndex
CREATE INDEX "Question_annonceId_createdAt_idx" ON "Question"("annonceId", "createdAt");

-- CreateIndex
CREATE INDEX "Question_authorId_idx" ON "Question"("authorId");

-- CreateIndex
CREATE INDEX "Question_answerAuthorId_idx" ON "Question"("answerAuthorId");
