"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnnonceProps } from "@/lib/types/AnnonceProps";
import { PublicationStatus, RealEstateStatus, Type } from "@prisma/client";

export default function EditAnnonceForm({ annonce }: { annonce: AnnonceProps }) {
    if (!annonce) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">Annonce introuvable</h2>
            </div>
        );
    }
    const router = useRouter();
    const [title, setTitle] = useState(annonce.title);
    const [address, setAddress] = useState(annonce.address);
    const [country, setCountry] = useState(annonce.country);
    const [city, setCity] = useState(annonce.city);
    const [postalCode, setPostalCode] = useState(annonce.postalCode);
    const [price, setPrice] = useState(String(annonce.price));
    const [description, setDescription] = useState(annonce.description);
    const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>(annonce.publicationStatus);
    const [surface, setSurface] = useState(String(annonce.surface ?? ""));
    const [numberOfRooms, setNumberOfRooms] = useState(String(annonce.numberOfRooms ?? ""));
    const [numberOfBathrooms, setNumberOfBathrooms] = useState(String(annonce.numberOfBathrooms ?? ""));
    const [floor, setFloor] = useState(String(annonce.floor ?? ""));
    const [yearBuilt, setYearBuilt] = useState(String(annonce.yearBuilt ?? ""));
    const [type, setType] = useState<Type>(annonce.type);
    const [avaibleFrom, setAvaibleFrom] = useState(
        annonce.avaibleFrom ? new Date(annonce.avaibleFrom).toISOString().slice(0, 10) : ""
    );
    const [realeSteateStatus, setRealeSteateStatus] = useState<RealEstateStatus>(annonce.realeSteateStatus);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/annonces/${annonce.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    address,
                    country,
                    city,
                    postalCode,
                    description,
                    price: Number(price),
                    publicationStatus,
                    surface: Number(surface),
                    numberOfRooms: Number(numberOfRooms),
                    numberOfBathrooms: Number(numberOfBathrooms),
                    floor: Number(floor),
                    yearBuilt: Number(yearBuilt),
                    type,
                    avaibleFrom: avaibleFrom ? new Date(avaibleFrom).toISOString() : null,
                    realeSteateStatus,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Échec de la mise à jour de l'annonce.");
            }

            setSuccess("Annonce mise à jour avec succès !");
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
            
        } catch (err: any) {
            setError(err.message ?? "Erreur inconnue");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex w-full flex-col items-center justify-start p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-[1200px] space-y-6">
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="mb-4 flex items-center justify-between rounded-md bg-green-50 p-3 text-sm text-green-700">
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess(null)}
                            className="ml-4 text-green-700 hover:text-green-900 focus:outline-none"
                            aria-label="Fermer">
                            ✕
                        </button>
                    </div>
                )}
                
                <h1 className="font-oswald font-bold text-3xl">Informations</h1>
                <div className="flex w-full flex-col gap-8 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Titre
                        </label>
                        <input
                            id="title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Adresse
                        </label>
                        <input
                            id="address"
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-8 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Ville
                        </label>
                        <input
                            id="city"
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            Pays
                        </label>
                        <input
                            id="country"
                            type="text"
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">
                            Code Postal
                        </label>
                        <input
                            id="codePostal"
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                    />
                </div>
                <div className="flex w-full flex-col gap-8 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Prix
                        </label>
                        <input
                            id="price"
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="surface" className="block text-sm font-medium text-gray-700">
                            Surface (m²)
                        </label>
                        <input
                            id="surface"
                            required
                            type="number"
                            step="0.01"
                            value={surface}
                            onChange={(e) => setSurface(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                        Statut de publication
                    </label>
                    <select
                        id="statut"
                        value={publicationStatus}
                        required
                        onChange={(e) => setPublicationStatus(e.target.value as PublicationStatus)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none">
                        <option value={PublicationStatus.UNPUBLISHED}>Non publié</option>
                        <option value={PublicationStatus.PUBLISHED}>Publié</option>
                    </select>
                </div>

                <div className="flex w-full flex-col gap-8 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                            Nombre de chambre
                        </label>
                        <input
                            id="rooms"
                            type="number"
                            required
                            value={numberOfRooms}
                            onChange={(e) => setNumberOfRooms(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                            Salles de bain
                        </label>
                        <input
                            id="bathrooms"
                            required
                            type="number"
                            value={numberOfBathrooms}
                            onChange={(e) => setNumberOfBathrooms(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex w-full flex-col gap-8 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                            Étage
                        </label>
                        <input
                            id="floor"
                            type="number"
                            required
                            value={floor}
                            onChange={(e) => setFloor(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                    <div className="w-full md:w-1/2">
                        <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                            Année de construction
                        </label>
                        <input
                            id="yearBuilt"
                            required
                            type="number"
                            value={yearBuilt}
                            onChange={(e) => setYearBuilt(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type
                    </label>
                    <select
                        id="type"
                        value={type}
                        required
                        onChange={(e) => setType(e.target.value as Type)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none">
                        <option value={Type.RENT}>Location</option>
                        <option value={Type.SALE}>Vente</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="avaibleFrom" className="block text-sm font-medium text-gray-700">
                        Disponible à partir du
                    </label>
                    <input
                        id="avaibleFrom"
                        required
                        type="date"
                        value={avaibleFrom}
                        onChange={(e) => setAvaibleFrom(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="reStatus" className="block text-sm font-medium text-gray-700">
                        Statut du bien
                    </label>
                    <select
                        id="reStatus"
                        required
                        value={realeSteateStatus}
                        onChange={(e) => setRealeSteateStatus(e.target.value as RealEstateStatus)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none">
                        <option value={RealEstateStatus.AVAILABLE}>Disponible</option>
                        <option value={RealEstateStatus.FORSALE}>À vendre</option>
                        <option value={RealEstateStatus.RENTED}>Loué</option>
                        <option value={RealEstateStatus.SOLD}>Vendu</option>
                    </select>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:bg-gray-400">
                        {isSubmitting ? "Edition en cours..." : "Sauvegarder informations"}
                    </button>
                </div>
            </form>
        </div>
    );
}