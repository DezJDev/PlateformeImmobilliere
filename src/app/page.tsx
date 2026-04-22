import { getLasPublishedAnnonces } from "@/lib/services/annonceService";
import { CardAnnonce } from "@/lib/components/annonceComponents/annonceCardComponent";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
    const cardCount = 4
    const lastPublishedAnnonces = await getLasPublishedAnnonces(cardCount);
    return (
        <main className="flex flex-col gap-24 mb-16">
            <div className="relative flex w-full flex-col items-center justify-center">
                <Image
                    src="/assets/maisonHomePage.avif"
                    alt="Maison Home Page"
                    width={1920}
                    height={600}
                    className="h-[400px] md:h-[600px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-700/60"></div>
                    <div className="absolute z-10 flex flex-col items-center justify-center gap-6">
                        <div className="w-full flex flex-col gap-6 p-10 items-center justify-center">
                            <h1 className="font-oswald text-7xl font-bold text-white">Nouveautés immobilières</h1>
                            <p className="font-oswald text-2xl font-light text-white">
                                Découvrez les dernières annonces ajoutées à notre plateforme
                            </p>
                            <button>
                                <Link
                                    href="#lookingTitle"
                                    className="hover:bg-secondary/80 font-oswald bg-red-700 px-10 py-3 text-lg font-bold text-white transition-colors duration-200 ease-in-out">
                                    Explorer
                                </Link>
                            </button>
                        </div>
                    </div>            
                </div>
            <div className="flex w-full flex-col items-center justify-center gap-10 px-0 md:px-16">
                <h1 id="lookingTitle" className="font-oswald text-3xl font-extralight">
                    Que recherchez vous?
                </h1>
                <div className="flex w-full flex-col md:flex-row">
                    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden md:w-1/2">
                        <Image
                            src="/assets/maisonLocation.avif"
                            alt="Maison Home Page"
                            width={1920}
                            height={400}
                            className="absolute inset-0 z-0 h-full w-full object-cover"
                        />

                        <div className="bg-primary/75 absolute inset-0 z-10"></div>

                        <Link
                            href="annonces/buy"
                            className="font-oswald relative z-20 flex h-full w-full items-center justify-center text-center text-7xl font-bold text-white transition-colors duration-200 ease-in-out hover:text-red-700">
                            Achat
                        </Link>
                    </div>
                    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden md:w-1/2">
                        <Image
                            src="/assets/maisonAchat.avif"
                            alt="Maison Home Page"
                            width={1920}
                            height={400}
                            className="absolute inset-0 z-0 h-full w-full object-cover"
                        />

                        <div className="bg-secondary/60 absolute inset-0 z-10"></div>

                        <Link
                            href="annonces/rent"
                            className="font-oswald relative z-20 flex h-full w-full items-center justify-center text-center text-7xl font-bold text-white transition-colors duration-200 ease-in-out hover:text-red-700">
                            Location
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-10  px-4 md:px-12">
                <h1 id="lookingTitle" className="font-oswald text-3xl font-extralight">
                    Les dernières annonces publiées
                </h1>

                {lastPublishedAnnonces.length === 0 ? (
                    <p className="text-lg text-gray-500 italic">Aucune annonce publiée pour le moment.</p>
                ) : (
                    <div className={`flex w-full flex-col flex-wrap items-center justify-center gap-8 md:flex-row max-w-[1600px]`}>
                        {lastPublishedAnnonces.map((annonce) => (
                            <div key={annonce.id} className="w-4/5 md:w-1/5 min-w-[260px]">
                                <CardAnnonce key={annonce.id} {...annonce} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
