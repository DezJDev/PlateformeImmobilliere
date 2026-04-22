"use client";

import { useState } from "react";
import { CardAnnonce } from "@/lib/components/annonceComponents/annonceCardComponent";
import Link from "next/link";
import { AnnonceProps } from "@/lib/types/AnnonceProps";
import type { Prisma, Question } from "@prisma/client";
import UserTable from "./usertab";
import { UserProps } from "@/lib/types/UserProps";

type Data = {
    annonces: AnnonceProps[];
    questions: Question[];
    answers: any[];
    users: UserProps[] | null;
};

export default function ProfileTabsClient({
    data,
    userRole,
    isOwner,
}: {
    data: Data;
    userRole: string;
    isOwner: boolean;
}) {
    const [tab, setTab] = useState<"annonces" | "questions" | "answers" | "users">("annonces");

    return (
        <section className="w-full">
            <div className="flex gap-4">
                {(["annonces", "questions", "answers", "users"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`font-oswald rounded-xl px-4 py-2 transition ${tab === t ? "bg-secondary text-white" : "bg-primary hover:bg-secondary text-white"} `}>
                        {t === "annonces"
                            ? "Annonces"
                            : t === "questions"
                              ? "Questions"
                              : t === "answers"
                                ? "Réponses"
                                : "Utilisateurs"}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {(userRole === "ADMIN" || userRole ==="AGENT") &&
                    isOwner &&
                    tab === "annonces" &&
                    (data.annonces.length === 0 ? (
                        <p className="text-white/70 italic">Aucune annonce.</p>
                    ) : (
                        <div className="flex w-full  flex-col flex-wrap items-center gap-8 md:flex-row">
                            {data.annonces.map((a) => (
                                <div key={a.id} className="min-w-[260px]">
                                    <CardAnnonce {...a} />
                                </div>
                            ))}
                        </div>
                    ))}
                {tab === "questions" &&
                    (data.questions.length === 0 ? (
                        <Empty label="Aucune question." />
                    ) : (
                        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
                            {data.questions.map((q: Question) => (
                                <li key={q.id} className="p-4">
                                    <Link
                                        className="hover:text-secondary hover:cursor-pointer"
                                        scroll={true}
                                        href={`/annonces/${q.annonceId}#question${q.id}`}>
                                        {q.content}
                                    </Link>
                                    <p className="mt-1 text-sm">
                                        Publié le {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ))}

                {tab === "answers" &&
                    (data.answers.length === 0 ? (
                        <Empty label="Aucune réponse." />
                    ) : (
                        <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
                            {data.answers.map((q: any) => (
                                <li key={q.id} className="p-4">
                                    <Link
                                        className="hover:text-secondary hover:cursor-pointer"
                                        scroll={true}
                                        href={`/annonces/${q.annonceId}#question${q.id}`}>
                                        {q.answer}
                                    </Link>
                                    <p className="mt-1 text-sm">
                                        Répondu le {new Date(q.createdAt).toLocaleDateString("fr-FR")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ))}

                {tab === "users" && userRole === "ADMIN" &&<UserTable users={data.users} />}
            </div>
        </section>
    );
}

function Empty({ label, cta }: { label: string; cta?: { href: string; text: string } }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
            <p>{label}</p>
            {cta && (
                <Link
                    href={cta.href}
                    className="bg-secondary hover:bg-secondary/80 mt-4 inline-block rounded-xl px-4 py-2">
                    {cta.text}
                </Link>
            )}
        </div>
    );
}
