// src/app/login/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl,
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-3xl font-bold text-gray-900">
                        Immo<span className="text-gray-500">Next</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenue</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Nouveau ici ?{" "}
                        <Link href="/register" className="font-medium text-gray-800 underline hover:text-black">
                            Créez un compte
                        </Link>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
                            >
                                Se connecter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
