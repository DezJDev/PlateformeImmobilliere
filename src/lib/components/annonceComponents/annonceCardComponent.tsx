import React from "react";
import Link from "next/link";
import { AnnonceProps } from "@/lib/types/AnnonceProps";
import RoomComponent from "./chunks/roomComponent";
import BathRoomComponent from "./chunks/bathRoomComponent";
import FloorComponent from "./chunks/floorComponent";
import AeraComponent from "./chunks/aeraComponent";

type CardAnnonceProps = Pick<
    AnnonceProps,
    | "id"
    | "title"
    | "address"
    | "city"
    | "postalCode"
    | "country"
    | "price"
    | "mainImg"
    | "surface"
    | "numberOfRooms"
    | "numberOfBathrooms"
    | "floor"
    | "yearBuilt"
    | "type"
    | "avaibleFrom"
    | "realeSteateStatus"
>;

export const CardAnnonce: React.FC<CardAnnonceProps> = ({
    id,
    title,
    address,
    city,
    postalCode,
    country,
    price,
    mainImg,
    surface,
    numberOfRooms,
    numberOfBathrooms,
    floor,
    yearBuilt,
    type,
    avaibleFrom,
    realeSteateStatus,
}) => {
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
    }).format(price);

    const formattedDate = new Date(avaibleFrom).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const imageSrc = mainImg ? `data:image/jpeg;base64,${mainImg}` : "/default-image-annonce.jpg";
    const available = realeSteateStatus !== "RENTED" && realeSteateStatus !== "SOLD";

    return (
        <div className="group relative flex w-full min-w-[260px] flex-col bg-white shadow-sm">
            <Link
                href={`/annonces/${id}`}
                className="absolute inset-0 z-10"
                aria-label={`Voir les détails de ${title}`}></Link>

            <div className="relative">
                <div className="overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="h-48 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />
                </div>
                {realeSteateStatus === "RENTED" && (
                    <div className="absolute top-[50%] left-[0%] w-full bg-red-700/80 px-3 py-1 text-center text-sm font-semibold text-white uppercase">
                        LOUé
                    </div>
                )}

                {realeSteateStatus === "SOLD" && (
                    <div className="absolute top-[50%] left-[0%] w-full bg-red-700/80 px-3 py-1 text-center text-sm font-semibold text-white">
                        VENDU
                    </div>
                )}
                {available && (
                    <div className="absolute bottom-0 left-0 bg-red-700/80 px-3 py-1 text-sm font-semibold text-white">
                        {type === "RENT" ? "LOCATION" : "ACHAT"}
                    </div>
                )}
            </div>

            <div className="px-4">
                <div className="mb-4 flex flex-col gap-2 border-b-2 border-gray-200 py-4 pb-5">
                    <h3 className="font-oswald text-2xl font-semibold text-gray-900">{title}</h3>
                    <p className="font-oswald text-sm text-gray-600">
                        {city}, {country}
                    </p>
                    <p className="text-xl font-bold text-gray-800">{formattedPrice}</p>
                </div>
                <div className="flex w-full items-center justify-between pb-4">
                    <RoomComponent value={numberOfRooms} />
                    <BathRoomComponent value={numberOfBathrooms} />
                    <FloorComponent value={floor} />
                    <AeraComponent value={surface} />
                </div>
            </div>
        </div>
    );
};
