/*
  Warnings:

  - You are about to drop the column `codePostal` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `imagePrincipale` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `pays` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `titre` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `ville` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the `AutresImages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."AutresImages" DROP CONSTRAINT "AutresImages_annonceId_fkey";

-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "codePostal",
DROP COLUMN "imagePrincipale",
DROP COLUMN "pays",
DROP COLUMN "prix",
DROP COLUMN "titre",
DROP COLUMN "ville",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "mainImg" TEXT,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AutresImages";

-- CreateTable
CREATE TABLE "GalleryImg" (
    "id" SERIAL NOT NULL,
    "annonceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageData" TEXT NOT NULL,

    CONSTRAINT "GalleryImg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GalleryImg_annonceId_idx" ON "GalleryImg"("annonceId");

-- AddForeignKey
ALTER TABLE "GalleryImg" ADD CONSTRAINT "GalleryImg_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
