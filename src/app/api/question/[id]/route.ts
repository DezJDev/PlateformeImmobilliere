import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/global/globalPrisma";
import { addQuestionAnswer } from "@/lib/services/questionService";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
        }
        const userId = Number((session.user as any).id);
        const role = (session.user as any).role as "ADMIN" | "AGENT" | "USER";

        const qid = Number(params.id);
        if (!Number.isFinite(qid)) {
            return NextResponse.json({ error: "ID de question invalide." }, { status: 400 });
        }

        const { answer } = await req.json();
        if (typeof answer !== "string" || !answer.trim()) {
            return NextResponse.json({ error: "Réponse invalide." }, { status: 400 });
        }

        const question = await prisma.question.findUnique({
            where: { id: qid },
            include: { annonce: { select: { agentId: true } } },
        });
        if (!question) {
            return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
        }

        const isOwnerAgent = question.annonce.agentId === userId;
        const isAdmin = role === "ADMIN";
        if (!isOwnerAgent && !isAdmin) {
            return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
        }

        const updated = addQuestionAnswer({
            questionId: qid,
            answer: answer,
            responderId: userId,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (e) {
        console.error("PATCH /api/questions/[id]/answer error:", e);
        return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ error: "ID invalide." }, { status: 400 });
        }
        await prisma.question.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (e: any) {
        if (e?.code === "P2025") {
            return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
        }
        console.error("DELETE /api/question/[id] error:", e);
        return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
    }
}
