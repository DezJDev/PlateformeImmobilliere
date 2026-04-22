import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAnnonceByIdInclude } from "@/lib/services/annonceService";
import type { AnnonceProps, AnnonceWithIncludes } from "@/lib/types/AnnonceProps";
import EditAnnonceSwitcher from "@/lib/components/annonceComponents/editAnnonceSwitcherComponent";
import { Question } from "@prisma/client";

export default async function EditAnnoncePage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role === "USER") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mx-auto w-full max-w-md text-center">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Accès refusé</h2>
                    <p className="mb-6 text-gray-600">
                        Vous devez être connecté en tant qu'agent immobilier pour modifier une annonce.
                    </p>
                </div>
            </div>
        );
    }

    const annonceId = Number(params.id);
    const annonce = await getAnnonceByIdInclude(annonceId);

    return (
        <EditAnnonceSwitcher
            annonce={annonce as AnnonceWithIncludes}
            annonceId={annonceId}
            gallery={annonce?.gallery}
        />
    );
}
