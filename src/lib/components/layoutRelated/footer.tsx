// /components/Header.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Footer() {
    const { data: session } = useSession();
    const [active, setActive] = useState<string | null>(null);
    useEffect(() => {
        const path = window.location.pathname;
        if (path === "/") {
            setActive("home");
        } else if (path.startsWith("/annonces/location")) {
            setActive("rent");
        } else if (path.startsWith("/annonces/buy")) {
            setActive("achats");
        }
    }, []);

    return (
        <footer className="bg-primary relative z-50 py-12">
            <div className="container mx-auto flex flex-col justify-between gap-12 px-6 md:flex-row">
                <div className="font-oswald flex flex-col items-start justify-center gap-3">
                    <div className="mb-5 flex items-center space-x-3">
                        <svg
                            preserveAspectRatio="xMidYMid meet"
                            viewBox="7.767 51.693 183.51 85.375"
                            height="50"
                            width="50"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-label="Page d'accueil">
                            <g>
                                <path
                                    fill="#ffffff"
                                    d="M178.752 121.175h-8V92.854l-42.739-31.219L99.51 82.877H29.201v38.298h-8V74.877h75.655l31.109-23.184 50.787 37.099v32.383z"></path>
                                <path fill="#ffffff" d="M191.277 129.068v8H7.767v-8h183.51z"></path>
                                <path fill="#ffffff" d="M131.794 91.26v15.298h-8V91.26h8z"></path>
                                <path fill="#ffffff" d="M75.724 91.26v15.298h-8V91.26h8z"></path>
                                <path fill="#ffffff" d="M51.213 91.26v15.298h-8V91.26h8z"></path>
                            </g>
                        </svg>
                        <Link href="/" className="text-2xl font-bold text-white">
                            Immo<span className="text-gray-400">Next</span>
                        </Link>
                    </div>

                    <Link href="/" onClick={(e) => e.preventDefault()} className="text-sm font-extralight text-white">
                        Politique de cookies
                    </Link>
                    <Link href="/" onClick={(e) => e.preventDefault()} className="text-sm font-extralight text-white">
                        Mentions légales
                    </Link>
                    <Link href="/" onClick={(e) => e.preventDefault()} className="text-sm font-extralight text-white">
                        Politique de confidentialité
                    </Link>
                    <Link href="/" onClick={(e) => e.preventDefault()} className="text-sm font-extralight text-white">
                        © 2025 par Adrien Delmastro & Jérémy Dézétree
                    </Link>
                </div>

                <div className="font-oswald flex flex-col items-start justify-center gap-3">
                    <Link href="/annonces/buy" className="text-sm font-extralight text-white">
                        Achats
                    </Link>
                    <Link href="/annonces/rent" className="text-sm font-extralight text-white">
                        Locations
                    </Link>
                    <Link href="/" className="text-sm font-extralight text-white">
                        Politique de confidentialité
                    </Link>
                </div>

                <div className="font-oswald flex flex-col items-start md:items-end justify-center gap-3">
                    <p className="text-sm font-extralight text-white">
                       A111 
                    </p>
                    <p className="text-sm font-extralight text-white">
                        M2 IWOCS 
                    </p>
                    <p className="text-sm font-extralight text-white">
                       Université le Havre Normandie 
                    </p>
                    <p className="text-sm font-extralight text-white">
                        25 Rue Philippe Lebon 
                    </p>
                    <p className="text-sm font-extralight text-white">
                        76600
                    </p>
                    <p className="text-sm font-extralight text-white">
                        Le Havre
                    </p>
                </div>
            </div>
        </footer>
    );
}
