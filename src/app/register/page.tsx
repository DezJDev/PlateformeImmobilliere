"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
    const router = useRouter();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                    dob,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Une erreur est survenue.");
            }

            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-3xl font-bold text-gray-900">
                        Immo<span className="text-gray-500">Next</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Déjà membre ?{" "}
                        <Link href="/login" className="font-medium text-gray-800 underline hover:text-black">
                            Connectez-vous
                        </Link>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                                Prénom
                            </label>
                            <input
                                id="firstname"
                                type="text"
                                required
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <input
                                id="lastname"
                                type="text"
                                required
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                                Date de naissance
                            </label>
                            <input
                                id="dob"
                                type="date"
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 shadow-sm focus:border-gray-500 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none disabled:bg-gray-400"
                            >
                                {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
