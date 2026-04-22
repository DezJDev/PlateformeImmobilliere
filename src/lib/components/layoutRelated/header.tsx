// Header.tsx (Server Component)
import Link from "next/link";
import HeaderAuth from "./headAuth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/global/globalPrisma";
import { getServerSession } from "next-auth";

export async function Header() {
    const session = await getServerSession(authOptions);
    let user;
    if (!session || !session.user) {
        user = null;
    } else {
        user = await prisma.user.findUnique({
            where: { id: Number(session.user.id) },
        });
    }
    return (
        <header className="bg-primary relative z-50 flex-col items-center pr-0 pb-4 md:flex md:flex-row md:pr-6 md:pb-0">
            <div className="tw-flex border-secondary font-oswald mr-0 flex h-full w-full items-center justify-center border-b-5 pr-2 pl-6 md:mr-auto md:w-fit">
                <div className="flex items-center space-x-3">
                    <svg
                        preserveAspectRatio="xMidYMid meet"
                        data-bbox="7.767 51.693 183.51 85.375"
                        viewBox="7.767 51.693 183.51 85.375"
                        height="50"
                        width="50"
                        xmlns="http://www.w3.org/2000/svg"
                        data-type="color"
                        role="img"
                        aria-label="Page d'accueil">
                        <g>
                            <path
                                fill="#ffffff"
                                d="M178.752 121.175h-8V92.854l-42.739-31.219L99.51 82.877H29.201v38.298h-8V74.877h75.655l31.109-23.184 50.787 37.099v32.383z"
                                data-color="1"></path>
                            <path fill="#ffffff" d="M191.277 129.068v8H7.767v-8h183.51z" data-color="1"></path>
                            <path fill="#ffffff" d="M131.794 91.26v15.298h-8V91.26h8z" data-color="1"></path>
                            <path fill="#ffffff" d="M75.724 91.26v15.298h-8V91.26h8z" data-color="1"></path>
                            <path fill="#ffffff" d="M51.213 91.26v15.298h-8V91.26h8z" data-color="1"></path>
                        </g>
                    </svg>
                    <Link href="/" className="text-2xl font-bold text-white">
                        Immo<span className="text-gray-400">Next</span>
                    </Link>
                </div>
            </div>

            <HeaderAuth user={user} />
        </header>
    );
}
