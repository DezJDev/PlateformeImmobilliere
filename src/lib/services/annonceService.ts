import { Annonce, Prisma, PublicationStatus, RealEstateStatus, Type } from "@prisma/client";
import prisma from "@/lib/global/globalPrisma";
import { AnnonceWithIncludes } from "../types/AnnonceProps";
import { QuestionProp } from "../types/QuestionProp";

export const createAnnonce = async (data: {
    agentId: number;
    title: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    description: string;
    price: number;
    surface?: number;
    numberOfRooms?: number;
    numberOfBathrooms?: number;
    floor?: number;
    yearBuilt?: number;
    type?: Type;
    avaibleFrom?: string | null;
    publicationStatus?: PublicationStatus;
    realeSteateStatus?: RealEstateStatus;
    mainImg?: string;
}): Promise<Annonce> => {
    const annonce = await prisma.annonce.create({
        data: {
            agentId: data.agentId,
            title: data.title,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            description: data.description,
            price: data.price,
            mainImg: data.mainImg ?? null,
            surface: data.surface ?? 0,
            numberOfRooms: data.numberOfRooms ?? 0,
            numberOfBathrooms: data.numberOfBathrooms ?? 0,
            floor: data.floor ?? 0,
            yearBuilt: data.yearBuilt ?? 0,
            avaibleFrom: data.avaibleFrom ? new Date(data.avaibleFrom) : new Date(),
            type: data.type ?? Type.RENT,
            publicationStatus: data.publicationStatus ?? PublicationStatus.UNPUBLISHED,
            realeSteateStatus: data.realeSteateStatus ?? RealEstateStatus.AVAILABLE,
        },
    });
    return annonce;
};

export const getAnnonceById = async (id: number): Promise<Annonce | null> => {
    return await prisma.annonce.findUnique({
        where: { id },
    });
};

export const updateAnnonce = async (
    id: number,
    data: {
        title?: string;
        address?: string;
        ville?: string;
        codePostal?: string;
        pays?: string;
        description?: string;
        prix?: number;
    }
): Promise<Annonce> => {
    return await prisma.annonce.update({
        where: { id },
        data: {
            title: data.title,
            address: data.address,
            city: data.ville,
            postalCode: data.codePostal,
            country: data.pays,
            description: data.description,
            price: data.prix,
        },
    });
};

export const deleteAnnonce = async (id: number): Promise<Annonce> => {
    return await prisma.annonce.delete({
        where: { id },
    });
};

export const getAllAnnonces = async (): Promise<Annonce[]> => {
    return await prisma.annonce.findMany();
};

type EditableAnnonceInput = Partial<
    Pick<
        Annonce,
        | "title"
        | "address"
        | "city"
        | "postalCode"
        | "country"
        | "description"
        | "price"
        | "publicationStatus"
        | "realeSteateStatus"
        | "mainImg"
        | "surface"
        | "numberOfRooms"
        | "numberOfBathrooms"
        | "floor"
        | "yearBuilt"
        | "type"
        | "avaibleFrom"
    >
>;

export const editAnnonce = (id: number, data: Partial<EditableAnnonceInput>): Promise<Annonce> => {
    return prisma.annonce.update({
        where: { id },
        data,
    });
};

export const editAnnonceImage = (id: number, base64Image: string): Promise<Annonce> => {
    return prisma.annonce.update({
        where: { id },
        data: { mainImg: base64Image },
    });
};

export const getLasPublishedAnnonces = async (limit: number): Promise<Annonce[]> => {
    return await prisma.annonce.findMany({
        where: { publicationStatus: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
};
export const getToBuyAnnonces = async (limit: number): Promise<Annonce[]> => {
    return await prisma.annonce.findMany({
        where: {
            publicationStatus: "PUBLISHED",
            realeSteateStatus: { in: ["FORSALE", "SOLD"] },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
};

const whereToBuy: Prisma.AnnonceWhereInput = {
    publicationStatus: PublicationStatus.PUBLISHED,
    type: { in: [Type.SALE] },
};

const whereToRent: Prisma.AnnonceWhereInput = {
    publicationStatus: PublicationStatus.PUBLISHED,
    type: { in: [Type.RENT] },
};

export async function getToBuyAnnoncesPagined(params: { limit: number; cursor?: number }) {
    const { limit, cursor } = params;
    const items = await prisma.annonce.findMany({
        where: whereToBuy,
        orderBy: { id: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? sliced[sliced.length - 1].id : undefined;

    return { items: sliced, nextCursor, hasMore };
}

export async function getToRentAnnoncesPagined(params: { limit: number; cursor?: number }) {
    const { limit, cursor } = params;
    const items = await prisma.annonce.findMany({
        where: whereToRent,
        orderBy: { id: "desc" },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = items.length > limit;
    const sliced = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? sliced[sliced.length - 1].id : undefined;

    return { items: sliced, nextCursor, hasMore };
}

type PrismaAnnonceWithIncludes = Prisma.AnnonceGetPayload<{
    include: {
        gallery: true;
        questions: {
            include: {
                author: { select: { firstName: true; lastName: true } };
                answerAuthor: { select: { firstName: true; lastName: true } };
            };
        };
        agent: true;
    };
}>;

function toQuestionProp(q: PrismaAnnonceWithIncludes["questions"][number]): QuestionProp {
    return {
        id: q.id,
        annonceId: q.annonceId,
        authorId: q.authorId ?? null,
        authorName: q.author ? `${q.author.firstName} ${q.author.lastName}` : null,
        content: q.content,
        answer: q.answer ?? null,
        answerAuthorId: q.answerAuthorId ?? null,
        answerAuthorName: q.answerAuthor ? `${q.answerAuthor.firstName} ${q.answerAuthor.lastName}` : null,
        answeredAt: q.answeredAt ? q.answeredAt.toISOString() : null,
        createdAt: q.createdAt.toISOString(),
    };
}

function toAnnonceWithIncludes(a: PrismaAnnonceWithIncludes): AnnonceWithIncludes {
    return {
        id: a.id,
        title: a.title,
        address: a.address,
        city: a.city,
        postalCode: a.postalCode,
        country: a.country,
        description: a.description,
        price: a.price,
        mainImg: a.mainImg ?? null,
        publicationStatus: a.publicationStatus,
        avaibleFrom: a.avaibleFrom,
        surface: a.surface,
        numberOfRooms: a.numberOfRooms,
        numberOfBathrooms: a.numberOfBathrooms,
        floor: a.floor,
        yearBuilt: a.yearBuilt,
        type: a.type,
        realeSteateStatus: a.realeSteateStatus,
        gallery: a.gallery.map((g) => ({
            id: g.id,
            annonceId: g.annonceId,
            imageData: g.imageData,
            createdAt: g.createdAt.toISOString(),
            updatedAt: g.updatedAt.toISOString(),
        })),
        questions: a.questions.sort((x, y) => y.createdAt.getTime() - x.createdAt.getTime()).map(toQuestionProp),
        agent: a.agent,
    };
}

export const getAnnonceByIdInclude = async (id: number): Promise<AnnonceWithIncludes | null> => {
    const a = await prisma.annonce.findUnique({
        where: { id },
        include: {
            gallery: true,
            questions: {
                include: {
                    author: { select: { firstName: true, lastName: true } },
                    answerAuthor: { select: { firstName: true, lastName: true } },
                },
            },
            agent: true,
        },
    });

    if (!a) return null;
    return toAnnonceWithIncludes(a);
};

