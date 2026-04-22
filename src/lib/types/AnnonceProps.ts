import type { $Enums, Question, RealEstateStatus, Type } from "@prisma/client";
import { GalleryImg } from "./GalleryImgeProp";
import { QuestionProp } from "./QuestionProp";
import { UserProps } from "./UserProps";

export type PublicationStatus = $Enums.PublicationStatus;

export interface AnnonceProps {
    id: number;
    title: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    description: string;
    price: number;
    mainImg?: string | null;
    publicationStatus: PublicationStatus;
    realeSteateStatus: RealEstateStatus;
    avaibleFrom: Date;
    surface: number;
    numberOfRooms: number;
    numberOfBathrooms: number;
    floor: number;
    yearBuilt: number;
    type: Type;
}
export interface AnnonceWithIncludes extends AnnonceProps {
    gallery: GalleryImg[];
    questions: QuestionProp[];
    agent?: UserProps | null;
}
