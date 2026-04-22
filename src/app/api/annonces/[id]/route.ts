import { deleteAnnonce, editAnnonce } from "@/lib/services/annonceService";
import { Type, PublicationStatus, RealEstateStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const toNum = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
};
const toDateOrUndef = (v: any) => {
    if (!v) return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d;
};
const parseEnum = <T extends Record<string, string>>(E: T, v: any): T[keyof T] | undefined =>
    typeof v === "string" && v in E ? (v as T[keyof T]) : undefined;

const compact = <T extends Record<string, any>>(obj: T) =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ message: "ID invalide." }, { status: 400 });
        }

        if (!(req.headers.get("content-type") || "").includes("application/json")) {
            return NextResponse.json({ message: "Content-Type attendu: application/json." }, { status: 415 });
        }

        const body = await req.json();

        const updateData = compact({
            title: typeof body.title === "string" ? body.title : undefined,
            address: typeof body.address === "string" ? body.address : undefined,
            country: typeof body.country === "string" ? body.country : undefined,
            city: typeof body.city === "string" ? body.city : undefined,
            postalCode: typeof body.postalCode === "string" ? body.postalCode : undefined,
            description: typeof body.description === "string" ? body.description : undefined,

            price: toNum(body.price),
            surface: toNum(body.surface),
            numberOfRooms: toNum(body.numberOfRooms),
            numberOfBathrooms: toNum(body.numberOfBathrooms),
            floor: toNum(body.floor),
            yearBuilt: toNum(body.yearBuilt),

            type: parseEnum(Type, body.type),
            publicationStatus: parseEnum(PublicationStatus, body.publicationStatus),
            realeSteateStatus: parseEnum(RealEstateStatus, body.realeSteateStatus),

            avaibleFrom: toDateOrUndef(body.avaibleFrom),
        });

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "Aucun champ valide à mettre à jour." }, { status: 400 });
        }

        const numericFields = ["price", "surface", "numberOfRooms", "numberOfBathrooms", "floor", "yearBuilt"] as const;
        for (const f of numericFields) {
            if (body[f] !== undefined && updateData[f] === undefined) {
                return NextResponse.json({ message: `Champ numérique invalide: ${f}.` }, { status: 400 });
            }
        }
        if (body.avaibleFrom !== undefined && updateData.avaibleFrom === undefined) {
            return NextResponse.json({ message: "Date invalide: avaibleFrom." }, { status: 400 });
        }
        const enumChecks: Array<[keyof typeof updateData, any, string[]]> = [
            ["type", body.type, Object.keys(Type)],
            ["publicationStatus", body.publicationStatus, Object.keys(PublicationStatus)],
            ["realeSteateStatus", body.realeSteateStatus, Object.keys(RealEstateStatus)],
        ];
        for (const [key, raw, allowed] of enumChecks) {
            if (raw !== undefined && updateData[key] === undefined) {
                return NextResponse.json(
                    { message: `Valeur invalide pour ${String(key)}. Attendu: ${allowed.join(", ")}.` },
                    { status: 400 }
                );
            }
        }

        const updated = await editAnnonce(id, updateData);
        return NextResponse.json(updated, { status: 200 });
    } catch (e: any) {
        console.error("Erreur API (PUT /api/annonces/[id]) :", e);
        return NextResponse.json({ message: e?.message ?? "Erreur interne du serveur." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ message: "ID invalide." }, { status: 400 });
        }

        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ message: "Content-Type attendu: multipart/form-data." }, { status: 415 });
        }

        const form = await req.formData();
        const file = form.get("imagePrincipale");

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { message: "Aucun fichier fourni sous le champ 'imagePrincipale'." },
                { status: 400 }
            );
        }

        const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
        if (!ALLOWED.has(file.type)) {
            return NextResponse.json({ message: "Type d'image non autorisé." }, { status: 415 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = buffer.toString("base64");
        const updated = await editAnnonce(id, { mainImg: base64Image });
        return NextResponse.json(updated, { status: 200 });
    } catch (e: any) {
        console.error("Erreur API (PATCH /api/annonces/[id]) :", e);
        return NextResponse.json({ message: e?.message ?? "Erreur interne du serveur." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (!Number.isFinite(id)) {
            return NextResponse.json({ message: "ID invalide." }, { status: 400 });
        }

        deleteAnnonce(Number(params.id));
        return NextResponse.json({ message: "Annonce supprimée avec succès." }, { status: 200 });
    } catch (e: any) {
        console.error("Erreur lors de la suppression :", e);
        return NextResponse.json({ message: e?.message || "Erreur interne du serveur." }, { status: 500 });
    }
}
