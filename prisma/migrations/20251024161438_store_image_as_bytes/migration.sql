/*
  Warnings:

  - You are about to drop the column `images` on the `Annonce` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "images",
ADD COLUMN     "image" BYTEA;
