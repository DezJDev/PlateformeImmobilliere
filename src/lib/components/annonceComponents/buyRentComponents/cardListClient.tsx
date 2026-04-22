"use client";
import { useState, useRef } from "react";
import { CardAnnonce } from "../annonceCardComponent";

type Annonce = any;

type Props = {
    type: string;
    initialItems: Annonce[];
    initialCursor?: number;
    initialHasMore: boolean;
};

export default function CardListClient({ type, initialItems, initialCursor, initialHasMore }: Props) {
    const [annonces, setAnnonces] = useState<Annonce[]>(initialItems);
    const [cursor, setCursor] = useState<number | undefined>(initialCursor);
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const loadingRef = useRef(false);

    async function loadMore() {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/annonces/${type}?limit=4${cursor ? `&cursor=${cursor}` : ""}`, {
                cache: "no-store",
            });
            const data = await res.json();

            setAnnonces((prev) => {
                const byId = new Map<number, Annonce>(prev.map((a) => [a.id, a]));
                for (const it of data.items) byId.set(it.id, it);
                return Array.from(byId.values());
            });

            setCursor(data.nextCursor);
            setHasMore(Boolean(data.hasMore));
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }

    return (
        <div className="flex w-full flex-col items-center justify-center gap-24 mb-10">
            <div className="flex w-full max-w-[1600px] flex-col flex-wrap items-center justify-start gap-8 md:flex-row">
                {annonces.length === 0 ? (
                    <p className="mt-8 mb-[500px] text-center text-gray-500">
                        Aucune annonce disponible pour le moment.
                    </p>
                ) : (
                    annonces.map((a) => (
                        <div key={a.id} className="w-full min-w-[260px] md:w-1/5">
                            <CardAnnonce {...a} />
                        </div>
                    ))
                )}
            </div>

            {hasMore && annonces.length > 0 && (
                <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-60">
                    {isLoading ? "Chargement..." : "Voir plus"}
                </button>
            )}
        </div>
    );
}
