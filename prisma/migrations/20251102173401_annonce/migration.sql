-- DropForeignKey
ALTER TABLE "public"."Annonce" DROP CONSTRAINT "Annonce_agentId_fkey";

-- AlterTable
ALTER TABLE "Annonce" ALTER COLUMN "agentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "icone" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Annonce" ADD CONSTRAINT "Annonce_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
