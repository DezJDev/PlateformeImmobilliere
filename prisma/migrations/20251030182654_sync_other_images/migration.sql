/*
  Warnings:

  - You are about to drop the column `position` on the `AutresImages` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AutresImages_annonceId_position_key";

-- AlterTable
ALTER TABLE "AutresImages" DROP COLUMN "position",
ALTER COLUMN "updatedAt" DROP DEFAULT;
