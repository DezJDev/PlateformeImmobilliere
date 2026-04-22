import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/global/globalPrisma";
import EditUserForm from "@/lib/components/user/userEditForm";

export default async function EditProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return <div className="p-6 text-center">Veuillez vous connecter</div>;
    }

    const isAdmin = session.user.role === "ADMIN";

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
    });

    if (!user) {
        return <div className="p-6 text-center">Utilisateur introuvable</div>;
    }

    const userIso = {
        ...user,
        dob: user.dob ? user.dob.toISOString() : "",
    };

    // IMPORTANT: passe la valeur calculée
    return <EditUserForm user={userIso as any} isAdmin={isAdmin} />;
}
