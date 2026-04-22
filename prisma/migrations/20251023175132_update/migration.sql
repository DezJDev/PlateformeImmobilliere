/*
  Warnings:

  - Made the column `icone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Annonce" ALTER COLUMN "images" SET DEFAULT ARRAY['../../public/default-image-annonce.jpg']::TEXT[],
ALTER COLUMN "images" SET DATA TYPE TEXT[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "icone" SET NOT NULL,
ALTER COLUMN "icone" SET DEFAULT '../../public/default-profile-icone.jpg',
ALTER COLUMN "icone" SET DATA TYPE TEXT;
