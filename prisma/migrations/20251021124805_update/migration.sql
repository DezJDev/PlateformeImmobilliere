/*
  Warnings:

  - Added the required column `address` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codePostal` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pays` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ville` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annonce" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "codePostal" TEXT NOT NULL,
ADD COLUMN     "pays" TEXT NOT NULL,
ADD COLUMN     "ville" TEXT NOT NULL;
