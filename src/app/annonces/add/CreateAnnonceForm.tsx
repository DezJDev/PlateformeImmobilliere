"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";
import { PublicationStatus, RealEstateStatus, Type } from "@prisma/client";

export default function CreateAnnonceForm() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>(PublicationStatus.UNPUBLISHED);
    const [surface, setSurface] = useState("");
    const [numberOfRooms, setNumberOfRooms] = useState("");
    const [numberOfBathrooms, setNumberOfBathrooms] = useState("");
    const [floor, setFloor] = useState("");
    const [yearBuilt, setYearBuilt] = useState("");
    const [type, setType] = useState<Type>(Type.RENT);
    const [avaibleFrom, setAvaibleFrom] = useState("");
    const [realeSteateStatus, setRealeSteateStatus] = useState<RealEstateStatus>(RealEstateStatus.AVAILABLE);

    const [photoList, setPhotoList] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (photoList.length === 0) {
            setError("Veuillez ajouter au moins une image pour l'annonce.");
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("address", address);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("postalCode", postalCode);
        formData.append("description", description);

        formData.append("price", price);
        formData.append("surface", surface);
        formData.append("numberOfRooms", numberOfRooms);
        formData.append("numberOfBathrooms", numberOfBathrooms);
        formData.append("floor", floor);
        formData.append("yearBuilt", yearBuilt);

        formData.append("publicationStatus", publicationStatus);
        formData.append("type", type);
        formData.append("avaibleFrom", avaibleFrom ? new Date(avaibleFrom).toISOString() : "");
        formData.append("realeSteateStatus", realeSteateStatus);

        photoList.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const response = await fetch("/api/annonces", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Une erreur est survenue lors de la création de l'annonce.");
            }
            router.push("/");
        } catch (err: any) {
            console.error("Erreur lors de la création de l'annonce:", err);
            setError(err.message ?? "Erreur inconnue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 py-16">
            <div className="mx-auto w-full max-w-[1200px]">
                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                        <h1 className="font-oswald text-3xl font-bold">Informations</h1>

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
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                    Code Postal
                                </label>
                                <input
                                    id="postalCode"
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
                            <label htmlFor="publicationStatus" className="block text-sm font-medium text-gray-700">
                                Statut de publication
                            </label>
                            <select
                                id="publicationStatus"
                                required
                                value={publicationStatus}
                                onChange={(e) => setPublicationStatus(e.target.value as PublicationStatus)}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none">
                                <option value={PublicationStatus.UNPUBLISHED}>Non publié</option>
                                <option value={PublicationStatus.PUBLISHED}>Publié</option>
                            </select>
                        </div>

                        <div className="flex w-full flex-col gap-8 md:flex-row">
                            <div className="w-full md:w-1/2">
                                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                                    Nombre de chambres
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
                                    type="number"
                                    required
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
                                    type="number"
                                    required
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
                                required
                                value={type}
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
                                type="date"
                                required
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Images</label>
                            <Dropzone
                                onDrop={(acceptedFiles) => setPhotoList(acceptedFiles)}
                                accept={{
                                    "image/png": [".png"],
                                    "image/jpeg": [".jpg", ".jpeg"],
                                    "image/svg+xml": [".svg"],
                                }}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div
                                            {...getRootProps()}
                                            className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center hover:bg-gray-100">
                                            <input {...getInputProps()} />
                                            <p>Glissez-déposez vos photos ici, ou cliquez pour les sélectionner.</p>
                                            <p className="text-xs text-gray-500">
                                                Formats acceptés : PNG, JPG, JPEG, SVG
                                            </p>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>

                            {photoList.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>{photoList.length} fichier(s) sélectionné(s) :</p>
                                    <ul className="list-inside list-disc">
                                        {photoList.map((file) => (
                                            <li key={file.name}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:bg-gray-400">
                                {isSubmitting ? "Création en cours..." : "Ajouter l'annonce"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
