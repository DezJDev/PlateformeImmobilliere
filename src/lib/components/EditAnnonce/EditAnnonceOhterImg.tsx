"use client";
import { GalleryImg } from "@/lib/types/GalleryImgeProp";
import { useEffect, useMemo, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { useRouter } from "next/navigation";

type ExistingImage = {
    id: number | string;
    src: string;
};

type LocalPreview = {
    tmpId: string;
    file: File;
    src: string;
};

export default function EditAnnonceOtherImg({
    annonceId,
    annonceGallery,
}: {
    annonceId: number;
    annonceGallery: GalleryImg[] | undefined;
}) {
    const router = useRouter();

    const [existing, setExisting] = useState<ExistingImage[]>([]);
    const [pending, setPending] = useState<LocalPreview[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pendingUrlsRef = useRef<Set<string>>(new Set());

    const [deletingIds, setDeletingIds] = useState<Set<number | string>>(new Set());

    useEffect(() => {
        if (annonceGallery?.length) {
            const imgs: ExistingImage[] = annonceGallery.map((img) => ({
                id: (img as any).id ?? crypto.randomUUID(),
                src: `data:image/jpeg;base64,${img.imageData}`,
            }));
            setExisting(imgs);
        } else {
            setExisting([]);
        }
    }, [annonceGallery]);

    useEffect(() => {
        return () => {
            pendingUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
            pendingUrlsRef.current.clear();
        };
    }, []);

    function onDrop(files: File[]) {
        if (!files?.length) return;
        const next: LocalPreview[] = files.map((file) => {
            const src = URL.createObjectURL(file);
            pendingUrlsRef.current.add(src);
            return { tmpId: crypto.randomUUID(), file, src };
        });
        setPending((prev) => [...prev, ...next]);
    }

    function removePending(tmpId: string) {
        setPending((prev) => {
            const item = prev.find((p) => p.tmpId === tmpId);
            if (item) {
                if (pendingUrlsRef.current.has(item.src)) {
                    URL.revokeObjectURL(item.src);
                    pendingUrlsRef.current.delete(item.src);
                }
            }
            return prev.filter((p) => p.tmpId !== tmpId);
        });
    }

    async function handleDeleteExistingImage(imageId: number) {
        setError(null);
        setDeletingIds((s) => new Set(s).add(imageId));
        try {
            const res = await fetch(`/api/gallery/${imageId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Échec de la suppression de l'image.");
            }

            setExisting((prev) => prev.filter((img) => img.id !== imageId));

            router.refresh();
        } catch (e: any) {
            console.error(e);
            setError(e.message ?? "Erreur lors de la suppression de l'image.");
        } finally {
            setDeletingIds((s) => {
                const next = new Set(s);
                next.delete(imageId);
                return next;
            });
        }
    }

    async function handleUploadImages() {
        if (!pending.length) return;
        setUploading(true);
        setError(null);
        const fd = new FormData();
        pending.forEach((p) => fd.append("files", p.file));

        try {
            const res = await fetch(`/api/annonces/${annonceId}/gallery`, {
                method: "POST",
                body: fd,
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Échec de l'upload des images.");
            }
            pending.forEach((p) => {
                if (pendingUrlsRef.current.has(p.src)) {
                    URL.revokeObjectURL(p.src);
                    pendingUrlsRef.current.delete(p.src);
                }
            });
            setPending([]);
            router.refresh();
        } catch (e: any) {
            console.error(e);
            setError(e.message ?? "Erreur lors de l'upload des images.");
        } finally {
            setUploading(false);
        }
    }

    const hasImages = useMemo(() => existing.length > 0 || pending.length > 0, [existing.length, pending.length]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-start p-2">
            <div className="w-full max-w-[1200px] space-y-6">
                <h1 className="font-oswald text-3xl font-bold">Galerie photo</h1>
                {existing.length > 0 ? (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {existing.map((img, i) => {
                            const isDeleting = deletingIds.has(img.id);
                            return (
                                <div
                                    key={typeof img.id === "string" ? img.id : img.id.toString()}
                                    className="group relative">
                                    <img
                                        src={img.src}
                                        alt={`Image existante ${i + 1}`}
                                        className="h-48 w-full rounded-md object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingImage(Number(img.id))}
                                        disabled={isDeleting}
                                        className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black disabled:opacity-60"
                                        aria-label="Supprimer l'image"
                                        title="Supprimer">
                                        {isDeleting ? "..." : "Supprimer"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="mb-6 text-gray-500">Aucune image dans la galerie.</p>
                )}

                <Dropzone
                    multiple
                    onDrop={onDrop}
                    accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/webp": [".webp"],
                    }}
                    maxFiles={10}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div
                                {...getRootProps()}
                                className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center hover:bg-gray-100">
                                <input {...getInputProps()} />
                                <p>Glissez-déposez vos photos, ou cliquez pour sélectionner. (max 10)</p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (max 5 Mo)</p>
                            </div>
                        </section>
                    )}
                </Dropzone>

                {pending.length > 0 && (
                    <div>
                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
                            {pending.map((item) => (
                                <div key={item.tmpId} className="group relative">
                                    <img src={item.src} alt="Preview" className="h-28 w-full rounded-md object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePending(item.tmpId)}
                                        className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                                        aria-label="Retirer cette image"
                                        title="Retirer">
                                        Retirer
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleUploadImages}
                                disabled={uploading || pending.length === 0}
                                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50">
                                {uploading ? "Synchronisation…" : "Synchroniser les images"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    pending.forEach((p) => {
                                        if (pendingUrlsRef.current.has(p.src)) {
                                            URL.revokeObjectURL(p.src);
                                            pendingUrlsRef.current.delete(p.src);
                                        }
                                    });
                                    setPending([]);
                                }}
                                className="rounded-md border px-4 py-2 text-sm">
                                Annuler
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                {!hasImages && (
                    <p className="text-sm text-gray-500">Ajoutez vos premières images avec la zone ci-dessus.</p>
                )}
            </div>
        </div>
    );
}
