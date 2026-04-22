import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateAnnonceForm from "./CreateAnnonceForm";

export default async function CreateAnnoncePage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role === "USER") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 pb-16 mt-16">
                <div className="mx-auto w-full max-w-md text-center">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Accès refusé</h2>
                    <p className="mb-6 text-gray-600">
                        Vous devez être connecté en tant qu'agent immobilier pour ajouter une annonce.
                    </p>
                </div>
            </div>
        );
    }

    return <CreateAnnonceForm/>;
}
