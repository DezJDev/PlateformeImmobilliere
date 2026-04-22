import prisma from "@/lib/global/globalPrisma";
import { uploadOtherImage } from "@/lib/services/annonceOtherImgService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    const annonceId = Number(params.id);
    if (!Number.isFinite(annonceId)) {
        return NextResponse.json({ error: "annonceId invalide" }, { status: 400 });
    }
    const form = await req.formData();
    if (!form) return NextResponse.json({ error: "FormData invalide" }, { status: 400 });

    const files = form.getAll("files") as File[];

    try {
        const created = await prisma.$transaction(async (tx) => {
            const ids: { id: number }[] = [];
            for (const f of files) {
                const ab = await f.arrayBuffer();
                const base64 = Buffer.from(ab).toString("base64");
                const row = await tx.galleryImg.create({
                    data: { annonceId, imageData: base64 },
                    select: { id: true },
                });
                ids.push(row);
            }
            return ids;
        });

        return NextResponse.json(
            { ok: true, createdIds: created.map((c) => c.id), count: created.length },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur lors de l'upload" }, { status: 500 });
    }
}
