/*
  Warnings:

  - You are about to drop the column `statut` on the `Annonce` table. All the data in the column will be lost.
  - Added the required column `avaibleFrom` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfBathrooms` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfRooms` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surface` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearBuilt` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('UNPUBLISHED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "RealEstateStatus" AS ENUM ('FORSALE', 'SOLD', 'AVAILABLE', 'RENTED');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('RENT', 'SALE');

-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "statut",
ADD COLUMN     "avaibleFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "numberOfBathrooms" INTEGER NOT NULL,
ADD COLUMN     "numberOfRooms" INTEGER NOT NULL,
ADD COLUMN     "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'UNPUBLISHED',
ADD COLUMN     "realeSteateStatus" "RealEstateStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "surface" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'RENT',
ADD COLUMN     "yearBuilt" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."Statut";
