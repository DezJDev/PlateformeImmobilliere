/*
  Warnings:

  - You are about to drop the column `image` on the `Annonce` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "image",
ADD COLUMN     "imagePrincipale" BYTEA;
