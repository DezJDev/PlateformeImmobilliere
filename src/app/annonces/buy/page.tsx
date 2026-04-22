import { getAllAnnonces, getLasPublishedAnnonces } from "@/lib/services/annonceService";
import { CardAnnonce } from "@/lib/components/annonceComponents/annonceCardComponent";
import Image from "next/image";
import CardList from "@/lib/components/annonceComponents/buyRentComponents/CardListCompenent";

export default async function Home() {
    return (
        <main className="flex flex-col gap-24 min-h-screen">
            <div className="relative flex w-full flex-col items-center justify-center">
                <div className="relative flex h-[250px] w-full flex-col items-center justify-center overflow-hidden">
                    <Image
                        src="/assets/maisonPageAchat.avif"
                        alt="Maison Home Page"
                        width={41}
                        height={250}
                        className="absolute inset-0 z-0 h-full w-full object-cover"
                    />
                    <h1 className="font-oswald relative z-20 flex items-center justify-center text-center uppercase tracking-widest text-xl font-thin text-white">
                        Nos propriétés en exclusivités
                    </h1>
                    <h1 className="font-oswald relative z-20 flex items-center justify-center text-center text-4xl font-bold text-white mt-5">
                        Achat
                    </h1>
                    <div className="bg-primary/75 absolute inset-0 z-10"></div>
                </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-10 px-4 md:px-12">
                <CardList type = "buy"></CardList>
            </div>
        </main>
    );
}
