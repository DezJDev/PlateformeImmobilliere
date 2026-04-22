import Image from "next/image";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUserWithRelations } from "@/lib/services/userService";
import ProfileTabsClient from "@/lib/components/folderComponents/profilTabsComponent";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/global/globalPrisma";

export default async function ProfilPage({ params }: { params: { id: string } }) {
    const userId = Number(params.id);
    const session = await getServerSession(authOptions);
    const user = await getUserWithRelations(userId);
    if (!user) return notFound();

    const isOwner = Number(session?.user?.id) === user.id;
    let users;

    if (session?.user?.role === "ADMIN") {
        users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                dob: true,
                createdAt: true,
                icone: true,
            },
        });
    } else {
        users = null;
    }

    return (
        <main className="flex min-h-screen flex-col gap-10 px-4 py-8 md:px-12">
            <section className="relative w-full rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24">
                            <Image
                                src={
                                    user.icone
                                        ? `data:image/jpeg;base64,${user.icone}`
                                        : "/assets/defaultProfilPicture.webp"
                                }
                                alt="img"
                                fill
                                className="ring-secondary rounded-full object-cover ring-2"
                            />
                        </div>
                        <div>
                            <h1 className="font-oswald text-3xl font-bold">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="">Membre depuis {new Date(user.createdAt).toLocaleDateString("fr-FR")}</p>
                            <p className="">{user.email}</p>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex gap-3">
                            <a
                                href={`/profil/edit/${user.id}`}
                                className="bg-secondary font-oswald hover:bg-secondary/80 rounded-xl px-4 py-2 text-black transition">
                                Éditer le profil
                            </a>
                            {["ADMIN", "AGENT"].includes(user.role) && (
                                <a
                                    href={`/annonces/add`}
                                    className="border-secondary font-oswald text-secondary hover:bg-secondary/10 rounded-xl border px-4 py-2 transition">
                                    Nouvelle annonce
                                </a>
                            )}
                        </div>
                    )}
                </div>
                {["ADMIN", "AGENT"].includes(user.role) && isOwner && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard label="Annonces" value={user._count.annonces} />
                        <StatCard label="Questions" value={user._count.questions} />
                        <StatCard label="Réponses" value={user._count.answers} />
                    </div>
                )}
            </section>
            {["ADMIN", "AGENT"].includes(user.role) && isOwner && (
                <ProfileTabsClient
                    data={{
                        annonces: user.annonces,
                        questions: user.questions,
                        answers: user.answers,
                        users: users,
                    }}
                    userRole={user.role}
                    isOwner={isOwner}
                />
            )}
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="">{label}</div>
            <div className="font-oswald text-3xl">{value}</div>
        </div>
    );
}
