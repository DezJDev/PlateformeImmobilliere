"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnswerQuestionButton({ questionId }: { questionId: number }) {
    const [open, setOpen] = useState(false);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const router = useRouter();

    const submit = async () => {
        if (!answer.trim()) {
            setMsg("Écris une réponse avant d’envoyer.");
            return;
        }
        setLoading(true);
        setMsg(null);

        const res = await fetch(`/api/question/${questionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer }),
        });

        const data = await res.json().catch(() => ({}));
        setLoading(false);

        if (!res.ok) {
            setMsg(data?.error || "Impossible d’enregistrer la réponse.");
            return;
        }
        router.refresh();
        setAnswer("");
        setOpen(false);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="mt-3 inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-black font-roboto">
                Répondre
            </button>
        );
    }

    return (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
            <label htmlFor={`answer-${questionId}`} className="block text-sm font-medium text-gray-700">
                Votre réponse
            </label>
            <textarea
                id={`answer-${questionId}`}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                placeholder="Rédigez votre réponse…"
            />
            <div className="mt-2 flex items-center gap-2">
                <button
                    onClick={submit}
                    disabled={loading}
                    className="rounded-md bg-black px-3 py-1.5 text-white disabled:opacity-50 font-roboto hover:cursor-pointer">
                    {loading ? "Envoi…" : "Envoyer la réponse"}
                </button>
                <button
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 font-roboto hover:cursor-pointer">
                    Annuler
                </button>
                {msg && <p className="ml-2 text-sm text-red-600">{msg}</p>}
            </div>
        </div>
    );
}
