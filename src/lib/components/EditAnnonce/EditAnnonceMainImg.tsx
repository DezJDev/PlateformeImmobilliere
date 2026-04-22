"use client";

import { useEffect, useState } from "react";
import { AnnonceProps } from "@/lib/types/AnnonceProps";
import { useRouter } from "next/navigation";
import Dropzone from "react-dropzone";

export default function EditAnnonceMainImg({ annonce }: { annonce: AnnonceProps }) {
    if (!annonce) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold">Annonce introuvable</h2>
            </div>
        );
    }
    const router = useRouter();
    const [initialMainPhoto, setInitialMainPhoto] = useState<string | null>(null);
    const [photoPrincipaleFile, setphotoPrincipaleFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (annonce.mainImg) {
            setPreviewUrl(`data:image/jpeg;base64,${annonce.mainImg}`);
            setInitialMainPhoto(`data:image/jpeg;base64,${annonce.mainImg}`);
        }
    }, [annonce.mainImg]);

    async function handleUploadImage() {
        if (!photoPrincipaleFile) return;
        setImgError(null);
        setSuccess(null);
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("imagePrincipale", photoPrincipaleFile);

            const res = await fetch(`/api/annonces/${annonce.id}`, {
                method: "PATCH",
                body: fd,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Échec de la mise à jour de l'image.");
            }

            setSuccess("Image mise à jour avec succès !");

            // Scroll vers le haut pour voir le message
            window.scrollTo({ top: 0, behavior: "smooth" });

            // Faire disparaître le message après 3 secondes
            setTimeout(() => {
                setSuccess(null);
            }, 3000);

            // Mettre à jour l'image initiale
            setInitialMainPhoto(previewUrl);
            setphotoPrincipaleFile(null);

            router.refresh();
        } catch (e: any) {
            setImgError(e.message ?? "Erreur inconnue");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setUploading(false);
        }
    }

    function onDrop(files: File[]) {
        const f = files[0];
        if (!f) return;
        setphotoPrincipaleFile(f);
        setPreviewUrl(URL.createObjectURL(f));
        setSuccess(null);
        setImgError(null);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-2">
            <div className="space-y-6flex w-full max-w-[1200px] flex-col items-start justify-center">
                {imgError && (
                    <div className="mb-4 flex items-center justify-between rounded-md bg-red-50 p-3 text-sm text-red-700">
                        <span>{imgError}</span>
                        <button
                            onClick={() => setImgError(null)}
                            className="ml-4 text-red-700 hover:text-red-900 focus:outline-none"
                            aria-label="Fermer">
                            ✕
                        </button>
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

                <h1 className="font-oswald text-3xl font-bold">Image principale</h1>
                <div className="mt-8 flex w-full flex-col gap-8 md:flex-row">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Image principale"
                            className="h-[500px] w-auto rounded object-cover"
                        />
                    )}
                    <div className="w-full">
                        <Dropzone
                            multiple={false}
                            onDrop={onDrop}
                            accept={{
                                "image/png": [".png"],
                                "image/jpeg": [".jpg", ".jpeg"],
                                "image/webp": [".webp"],
                            }}
                            maxFiles={1}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div
                                        {...getRootProps()}
                                        className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center hover:bg-gray-100">
                                        <input {...getInputProps()} />
                                        <p>Glissez-déposez votre photo, ou cliquez pour sélectionner.</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (max 5 Mo)</p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>

                        {previewUrl && (
                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleUploadImage}
                                    disabled={!photoPrincipaleFile || uploading}
                                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed">
                                    {uploading ? "Mise à jour…" : "Sauvegarder"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setphotoPrincipaleFile(null);
                                        setImgError(null);
                                        setSuccess(null);
                                        setPreviewUrl(initialMainPhoto ? initialMainPhoto : null);
                                    }}
                                    className="rounded-md border px-4 py-2 text-sm hover:cursor-pointer">
                                    Annuler
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
