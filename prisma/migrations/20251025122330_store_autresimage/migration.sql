-- CreateTable
CREATE TABLE "AutresImages" (
    "id" SERIAL NOT NULL,
    "annonceId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageData" TEXT NOT NULL,

    CONSTRAINT "AutresImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutresImages_annonceId_idx" ON "AutresImages"("annonceId");

-- CreateIndex
CREATE UNIQUE INDEX "AutresImages_annonceId_position_key" ON "AutresImages"("annonceId", "position");

-- AddForeignKey
ALTER TABLE "AutresImages" ADD CONSTRAINT "AutresImages_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "Annonce"("id") ON DELETE CASCADE ON UPDATE CASCADE;
