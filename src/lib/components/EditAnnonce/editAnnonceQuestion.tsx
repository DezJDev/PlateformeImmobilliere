"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionProp } from "@/lib/types/QuestionProp";

type Props = {
    annonceId: number;
    annonceQuestion: QuestionProp[] | undefined;
};

export default function EditAnnonceQuestion({ annonceId, annonceQuestion }: Props) {
    const router = useRouter();

    if (!annonceQuestion || annonceQuestion.length === 0) {
        return (
            <div className="rounded-md border border-gray-200 p-4 text-gray-600 min-h-screen">Aucune question pour l’instant.</div>
        );
    }

    return (
        <div className="space-y-4 min-h-screen">
            {annonceQuestion.map((q) => (
                <QuestionItem key={q.id} q={q} onRefresh={() => router.refresh()} />
            ))}
        </div>
    );
}

function QuestionItem({ q, onRefresh }: { q: QuestionProp; onRefresh: () => void }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [answer, setAnswer] = useState(q.answer ?? "");
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const submit = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        setErr(null);
        try {
            const res = await fetch(`/api/question/${q.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: answer.trim() }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error || "Impossible d’enregistrer la réponse.");
            setOpen(false);
            onRefresh();
        } catch (e: any) {
            setErr(e?.message || "Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Supprimer cette question ? Cette action est irréversible.");
        if (!confirmed) return;

        setDeleting(true);
        setErr(null);
        try {
            const res = await fetch(`/api/question/${q.id}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || "Suppression impossible.");
            }
            onRefresh();
        } catch (e: any) {
            setErr(e?.message || "Erreur réseau.");
        } finally {
            setDeleting(false);
        }
    };

    const answeredAtText = q.answeredAt ? new Date(q.answeredAt).toLocaleDateString("fr-FR") : "";

    return (
        <div className="rounded-md border border-gray-200 p-4">
            <p className="font-medium text-gray-900">
                <span className="text-gray-800">{q.authorName ?? "Utilisateur anonyme"}</span> :
            </p>
            <p className="mt-1 text-gray-700">{q.content}</p>

            {err && <p className="mt-2 text-sm text-red-600">{err}</p>}

            <div className="mt-3 border-t border-gray-200 pt-3 text-gray-700">
                {q.answer && !open ? (
                    <div className="pl-6">
                        <p className="font-semibold">Réponse :</p>
                        <p className="mt-1">{q.answer}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            — {q.answerAuthorName ?? "Agent"} {answeredAtText && `le ${answeredAtText}`}
                        </p>

                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                                Modifier la réponse
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                {deleting ? "Suppression…" : "Supprimer"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pl-0">
                        {!open && (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">
                                    Répondre
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                    {deleting ? "Suppression…" : "Supprimer"}
                                </button>
                            </div>
                        )}

                        {open && (
                            <div className="mt-3">
                                <label
                                    htmlFor={`answer-${q.id}`}
                                    className="mb-1 block text-sm font-medium text-gray-700">
                                    Votre réponse
                                </label>
                                <textarea
                                    id={`answer-${q.id}`}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                    placeholder="Rédigez votre réponse…"
                                />
                                {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={submit}
                                        disabled={loading || !answer.trim()}
                                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50">
                                        {loading ? "Envoi…" : "Enregistrer"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            setErr(null);
                                            setAnswer(q.answer ?? "");
                                        }}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
