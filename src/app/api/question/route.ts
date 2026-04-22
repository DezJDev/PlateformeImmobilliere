import prisma from "@/lib/global/globalPrisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createQuestion } from "@/lib/services/questionService";

export async function POST(req: Request) {
    try {
        const { annonceId, content } = await req.json();

        if (!Number.isFinite(Number(annonceId)) || !content || typeof content !== "string") {
            return NextResponse.json({ error: "annonceId ou contenu invalide" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        const question = createQuestion({
            annonceId: Number(annonceId),
            content: content,
            authorId: Number(session.user?.id),
        });
        return NextResponse.json(question, { status: 201 });
    } catch (e: any) {
        console.error("POST /api/questions error:", e);
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}
