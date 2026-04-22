import { NextRequest, NextResponse } from "next/server";
import { createAnnonce, deleteAnnonce } from "@/lib/services/annonceService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PublicationStatus, RealEstateStatus, Type } from "@prisma/client";

function pickFirst(form: FormData, keys: string[]) {
    for (const k of keys) {
        const v = form.get(k);
        if (v !== null && v !== undefined && String(v).length > 0) return String(v);
    }
    return null;
}

function toNum(v: string | null) {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

function toEnum<T extends object>(enumObj: T, value: string | null): T[keyof T] | null {
    if (!value) return null;
    return value in enumObj ? (value as any) : null;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
        }
        const role = session.user?.role as string | undefined;
        if (!role || !["ADMIN", "AGENT"].includes(role)) {
            return NextResponse.json({ message: "Accès refusé." }, { status: 403 });
        }

        const formData = await req.formData();
        const agentId = session.user?.id;
        const title = pickFirst(formData, ["title"]);
        const address = pickFirst(formData, ["address"]);
        const country = pickFirst(formData, ["country", "pays"]);
        const city = pickFirst(formData, ["city", "ville"]);
        const postalCode = pickFirst(formData, ["postalCode", "codePostal"]);
        const description = pickFirst(formData, ["description"]);

        const priceStr = pickFirst(formData, ["price", "prix"]);
        const surfaceStr = pickFirst(formData, ["surface"]);
        const roomsStr = pickFirst(formData, ["numberOfRooms"]);
        const bathsStr = pickFirst(formData, ["numberOfBathrooms"]);
        const floorStr = pickFirst(formData, ["floor"]);
        const yearBuiltStr = pickFirst(formData, ["yearBuilt"]);

        const typeStr = pickFirst(formData, ["type"]);
        const publicationStatusStr = pickFirst(formData, ["publicationStatus"]);
        const reStatusStr = pickFirst(formData, ["realeSteateStatus"]);
        const avaibleFromStr = pickFirst(formData, ["avaibleFrom"]);

        const files = formData.getAll("images").filter(Boolean) as File[];
        const mainFile = files[0] ?? null;

        const price = toNum(priceStr);
        if (!agentId || !title || !price || !mainFile) {
            return NextResponse.json({ message: "Les champs requis sont manquants." }, { status: 400 });
        }

        const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
        if (!ALLOWED.has(mainFile.type)) {
            return NextResponse.json({ message: "Type d’image non autorisé." }, { status: 415 });
        }

        const surface = toNum(surfaceStr);
        const numberOfRooms = toNum(roomsStr);
        const numberOfBathrooms = toNum(bathsStr);
        const floor = toNum(floorStr);
        const yearBuilt = toNum(yearBuiltStr);

        const type = toEnum(Type, typeStr) ?? Type.RENT;
        const publicationStatus = toEnum(PublicationStatus, publicationStatusStr) ?? PublicationStatus.UNPUBLISHED;
        const realeSteateStatus = toEnum(RelEstateStatusShim(), reStatusStr) ?? RealEstateStatus.AVAILABLE;

        const avaibleFrom = avaibleFromStr && avaibleFromStr.length ? new Date(avaibleFromStr).toISOString() : null;

        const arrayBuffer = await mainFile.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        const newAnnonce = await createAnnonce({
            agentId: Number(agentId),
            title,
            address: address ?? "",
            country: country ?? "",
            city: city ?? "",
            postalCode: postalCode ?? "",
            description: description ?? "",
            price,
            surface: surface ?? undefined,
            numberOfRooms: numberOfRooms ?? undefined,
            numberOfBathrooms: numberOfBathrooms ?? undefined,
            floor: floor ?? undefined,
            yearBuilt: yearBuilt ?? undefined,
            type,
            avaibleFrom,
            publicationStatus,
            realeSteateStatus,
            mainImg: base64Image,
        });

        return NextResponse.json(newAnnonce, { status: 201 });
    } catch (error) {
        console.error("Erreur API lors de la création de l'annonce:", error);
        return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
    }
}

function RelEstateStatusShim() {
    return RealEstateStatus as Record<string, RealEstateStatus>;
}
