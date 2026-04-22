// src/app/api/gallery/[id]/route.ts
import prisma from "@/lib/global/globalPrisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
        return NextResponse.json({ error: "Paramètre id invalide." }, { status: 400 });
    }

    try {
        await prisma.galleryImg.delete({
            where: { id: idNum },
        })

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        if (e?.code === "P2025") {
            return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
        }
        console.error("DELETE gallery image error:", e);
        return NextResponse.json({ error: e?.message ?? "Erreur interne serveur." }, { status: 500 });
    }
}
