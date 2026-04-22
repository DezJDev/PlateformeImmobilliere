"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AnnonceWithIncludes } from "@/lib/types/AnnonceProps";
import type { GalleryImg } from "@/lib/types/GalleryImgeProp";
import EditAnnonceForm from "@/lib/components/EditAnnonce/EditAnnonceForm";
import EditAnnonceMainImg from "@/lib/components/EditAnnonce/EditAnnonceMainImg";
import EditAnnonceOtherImg from "@/lib/components/EditAnnonce/EditAnnonceOhterImg";
import EditAnnonceQuestion from "@/lib/components/EditAnnonce/editAnnonceQuestion";

type Props = {
    annonce: AnnonceWithIncludes;
    annonceId: number;
    gallery: GalleryImg[] | undefined;
};

type Tab = "form" | "main" | "gallery" | "question";

export default function EditAnnonceSwitcher({ annonce, annonceId, gallery }: Props) {
    const [active, setActive] = useState<Tab>("form");
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const btnBase = "px-4 py-2 text-sm font-medium border transition-colors rounded-md hover:cursor-pointer";
    const btnActive = "bg-gray-900 text-white border-gray-900";
    const btnIdle = "bg-white text-gray-800 border-gray-300 hover:bg-gray-100";
    const btnDanger =
        "bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50";

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
        );
        if (!confirmed) return;

        setDeleting(true);
        setError(null);

        try {
            const res = await fetch(`/api/annonces/${annonceId}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || "Erreur lors de la suppression.");
            }
            router.push("/");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Erreur inconnue.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-5xl p-4">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    className={`${btnBase} ${active === "form" ? btnActive : btnIdle}`}
                    onClick={() => setActive("form")}>
                    Informations
                </button>
                <button
                    type="button"
                    className={`${btnBase} ${active === "main" ? btnActive : btnIdle}`}
                    onClick={() => setActive("main")}>
                    Photo principale
                </button>
                <button
                    type="button"
                    className={`${btnBase} ${active === "gallery" ? btnActive : btnIdle}`}
                    onClick={() => setActive("gallery")}>
                    Galerie
                </button>
                <button
                    type="button"
                    className={`${btnBase} ${active === "question" ? btnActive : btnIdle}`}
                    onClick={() => setActive("question")}>
                    Questions
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`${btnBase} ${btnDanger}`}
                    title="Supprimer l’annonce">
                    {deleting ? "Suppression en cours..." : "Supprimer l’annonce"}
                </button>
            </div>

            <div className="relative w-full">
                {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

                <div className={active === "form" ? "block" : "hidden"}>
                    <EditAnnonceForm annonce={annonce} />
                </div>
                <div className={active === "main" ? "block" : "hidden"}>
                    <EditAnnonceMainImg annonce={annonce} />
                </div>
                <div className={active === "gallery" ? "block" : "hidden"}>
                    <EditAnnonceOtherImg annonceId={annonceId} annonceGallery={gallery} />
                </div>

                <div className={active === "question" ? "block" : "hidden"}>
                    <h3 className="font-oswald mb-4 text-[18px] font-medium">Questions</h3>
                    <EditAnnonceQuestion annonceId={annonceId} annonceQuestion={annonce.questions} />
                </div>
            </div>
        </div>
    );
}
