"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { UserProps } from "@/lib/types/UserProps";

interface HeaderAuthProps {
    user: UserProps | null;
}

export default function HeaderAuth({ user }: HeaderAuthProps) {
    const pathname = usePathname();
    const router = useRouter();

    const active =
        pathname === "/"
            ? "home"
            : pathname?.startsWith("/annonces/rent")
              ? "rent"
              : pathname?.startsWith("/annonces/buy")
                ? "buy"
                : pathname?.startsWith("/profil")
                  ? "profil"
                  : null;

    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";

    return (
        <nav>
            <ul className="mt-4 flex items-center justify-center space-x-4 font-(--font-roboto-thin) text-white md:mt-0">
                <li>
                    <Link href="/" className={`${active === "home" ? "text-secondary" : ""} `}>
                        Accueil
                    </Link>
                </li>
                <li>
                    <Link
                        href="/annonces/rent"
                        className={`hover:text-secondary transition-colors duration-200 ease-in-out hover:cursor-pointer ${
                            active === "rent" ? "text-secondary" : ""
                        }`}>
                        Locations
                    </Link>
                </li>
                <li>
                    <Link
                        href="/annonces/buy"
                        className={`hover:text-secondary transition-colors duration-200 ease-in-out hover:cursor-pointer ${
                            active === "buy" ? "text-secondary" : ""
                        }`}>
                        Achats
                    </Link>
                </li>
                {user ? (
                    <>
                        <li className="group relative text-white sm:block">
                            <div className={`hover:cursor-pointer ${active === "profil" ? "text-secondary" : ""}`}>
                                {firstName} {lastName}
                            </div>

                            <div className="pointer-events-none absolute inset-0 top-full h-2 w-full group-hover:pointer-events-auto"></div>

                            <div className="bg-primary invisible absolute top-full right-0 mt-2 w-full min-w-[120px] translate-y-1 rounded-md opacity-0 shadow-lg transition-all duration-150 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                <button
                                    onClick={() => router.push(`/profil/${user.id}`)}
                                    className={`hover:text-secondary w-full px-4 py-2 text-left transition-colors duration-200 ease-in-out hover:cursor-pointer ${active === "profil" ? "text-secondary" : ""}`}>
                                    Profil
                                </button>
                                <button
                                    onClick={() => {
                                        signOut({
                                            redirect: true,
                                            callbackUrl: "/login",
                                        });
                                    }}
                                    className="hover:text-secondary w-full px-4 py-2 text-left text-white transition-colors duration-200 ease-in-out hover:cursor-pointer">
                                    Déconnexion
                                </button>
                            </div>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link
                                href="/login"
                                className="hover:text-secondary transition-colors duration-200 ease-in-out hover:cursor-pointer">
                                Se connecter
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/register"
                                className="hover:text-secondary transition-colors duration-200 ease-in-out hover:cursor-pointer">
                                S'inscrire
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
