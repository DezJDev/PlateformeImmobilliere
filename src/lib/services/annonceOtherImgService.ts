import prisma from "@/lib/global/globalPrisma";
import { GalleryImg } from "../types/GalleryImgeProp";

export async function getOtherImagesByAnnonceId(annonceId: number): Promise<GalleryImg[]> {
    const images = await prisma.galleryImg.findMany({
        where: { annonceId },
        orderBy: { createdAt: "asc" },
        select: { id: true, annonceId: true, imageData: true },
    });
    return images ?? [];
}

export async function uploadOtherImage(annonceId: number, image: string): Promise<{ id: number }> {
    const created = await prisma.galleryImg.create({
        data: { annonceId, imageData: image },
        select: { id: true },
    });
    return created;
}
