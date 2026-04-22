"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddQuestionButton({ annonceId }: { annonceId: number }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const submit = async () => {
        if (!content.trim()) {
            setMsg("Écris ta question avant d’envoyer.");
            return;
        }
        setLoading(true);
        setMsg(null);

        const res = await fetch("/api/question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ annonceId, content }),
        });

        const data = await res.json().catch(() => ({}));
        setLoading(false);

        if (!res.ok) {
            setMsg(data?.error || "Impossible de créer la question.");
            return;
        }

        setContent("");
        setOpen(false);
        router.refresh();
    };

    return (
        <div className="mt-6">
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black font-roboto hover:cursor-pointer">
                    + Poser une question
                </button>
            ) : (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <label htmlFor="q" className="block text-sm font-medium text-gray-700">
                        Ta question
                    </label>
                    <textarea
                        id="q"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-gray-500 focus:outline-none text-black"
                        placeholder="Pose ta question ici…"
                    />
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            disabled={loading}
                            onClick={submit}
                            className="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black font-roboto">
                            {loading ? "Envoi…" : "Envoyer"}
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => setOpen(false)}
                            className="rounded-md border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 font-roboto">
                            Annuler
                        </button>
                        {msg && <p className="ml-2 text-sm text-red-600">{msg}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
