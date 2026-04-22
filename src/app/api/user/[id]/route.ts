import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/global/globalPrisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ message: "ID invalide." }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }

        const form = await req.formData();
        const firstName = String(form.get("firstName") ?? "").trim();
        const lastName = String(form.get("lastName") ?? "").trim();
        const email = String(form.get("email") ?? "").trim();
        const dobStr = String(form.get("dob") ?? "").trim();
        const roleRaw = form.get("role");
        const icon = form.get("icon");

        const dob = new Date(dobStr);
        if (isNaN(dob.getTime())) {
            return NextResponse.json({ message: "Date invalide." }, { status: 400 });
        }

        const isAdmin = session.user.role === "ADMIN";
        let roleToSet: string | undefined = undefined;
        if (isAdmin && typeof roleRaw === "string") {
            roleToSet = roleRaw;
        }

        let iconeUpdate: string | undefined;
        if (icon && icon instanceof File) {
            const buf = Buffer.from(await icon.arrayBuffer());
            iconeUpdate = buf.toString("base64");
        }
        const updateData: any = {
            firstName,
            lastName,
            email,
            dob,
            ...(roleToSet ? { role: roleToSet } : {}),
            ...(iconeUpdate ? { icone: iconeUpdate } : {}),
        };

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                dob: true,
                icone: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (e: any) {
        console.error("PUT /api/user/[id] error:", e);
        return NextResponse.json({ message: e?.message ?? "Erreur interne." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ message: "ID invalide." }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Compte supprimé avec succès." }, { status: 200 });
    } catch (e: any) {
        console.error("DELETE /api/user/[id] error:", e);
        return NextResponse.json({ message: e?.message ?? "Erreur interne." }, { status: 500 });
    }
}
