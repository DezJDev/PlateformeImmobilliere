import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAnnonceByIdInclude } from "@/lib/services/annonceService";
import ImageCarrousel from "@/lib/components/annonceComponents/ImageCarrousel";
import AddQuestionButton from "@/lib/components/EditAnnonce/addQuestionButtonComponent";
import AnswerQuestionButton from "@/lib/components/EditAnnonce/answerQuestionButtonComponent";
import RoomComponent from "@/lib/components/annonceComponents/chunks/roomComponent";
import BathRoomComponent from "@/lib/components/annonceComponents/chunks/bathRoomComponent";
import AeraComponent from "@/lib/components/annonceComponents/chunks/aeraComponent";
import FloorComponent from "@/lib/components/annonceComponents/chunks/floorComponent";
import YearComponent from "@/lib/components/annonceComponents/chunks/yearComponent";
import AvailableComponent from "@/lib/components/annonceComponents/chunks/availableComponent";
import { AnnonceDetailClient } from "@/lib/components/AnnonceSmooth";
import Link from "next/link";
import Image from "next/image";

export default async function AnnonceDetail({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const annonce = await getAnnonceByIdInclude(Number(params.id));
    if (!annonce) return <div className="p-20 text-center">Annonce non trouvée.</div>;

    const agent = annonce.agent;
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
    }).format(annonce.price);
    const imageSrc = annonce.mainImg ? `data:image/jpeg;base64,${annonce.mainImg}` : "/default-image-annonce.jpg";

    let imagesSrc = [];

    if (annonce.gallery && annonce.gallery.length > 0) {
        const autresImagesSrc = annonce.gallery.map((img) => `data:image/jpeg;base64,${img.imageData}`);
        imagesSrc = [imageSrc, ...autresImagesSrc];
    } else {
        imagesSrc = [imageSrc];
    }

    return (
        <AnnonceDetailClient>
            <div className="mx-auto flex max-w-[1300px] flex-col px-4 pt-22 pb-16 md:px-46">
                <div className="mb-8 flex items-end justify-between">
                    <h1 className="font-oswald text-primary text-5xl">{annonce.title}</h1>
                    {annonce.realeSteateStatus === "AVAILABLE" && (
                        <p className="font-oswald text-3xl font-extralight tracking-widest text-gray-600">Location</p>
                    )}
                    {annonce.realeSteateStatus === "RENTED" && (
                        <p className="font-oswald text-3xl font-extralight tracking-widest text-gray-600">Loué</p>
                    )}
                    {annonce.realeSteateStatus === "FORSALE" && (
                        <p className="font-oswald text-3xl font-extralight tracking-widest text-gray-600">Achat</p>
                    )}
                    {annonce.realeSteateStatus === "SOLD" && (
                        <p className="font-oswald text-3xl font-extralight tracking-widest text-gray-600">Vendu</p>
                    )}
                </div>
                <p className="font-oswald mb-8 text-xl text-red-600">{formattedPrice}</p>
                <ImageCarrousel images={imagesSrc} titre={annonce.title} />
                <div className="mt-16 flex flex-col flex-wrap items-center justify-center md:flex-row md:items-start md:justify-between">
                    <div className="w-full md:w-1/2">
                        <h3 className="font-oswald text-[18px] font-medium">Description de la propriété</h3>
                        <p className="font-roboto mt-6 mb-12 text-base/8 text-gray-700">{annonce.description}</p>
                        <div className="grid w-full grid-cols-3 grid-rows-2 place-items-center gap-x-8 gap-y-12">
                            <div>
                                <RoomComponent value={annonce.numberOfRooms} size={32} />
                            </div>
                            <div>
                                <BathRoomComponent value={annonce.numberOfBathrooms} size={32} />
                            </div>
                            <div>
                                <AeraComponent value={annonce.surface} size={32} />
                            </div>
                            <div>
                                <FloorComponent value={annonce.floor} size={32} />
                            </div>
                            <div>
                                <YearComponent value={annonce.yearBuilt} size={32} />
                            </div>
                            <div>
                                <AvailableComponent
                                    value={new Date(annonce.avaibleFrom).toLocaleDateString("fr-FR")}
                                    size={32}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 flex h-fit w-fit max-w-[300px] flex-col bg-[#f3f7fa] px-6 py-8 md:mt-0">
                        <h2 className="font-oswald text-2xl font-medium">
                            {annonce.agent
                                ? `${annonce.agent.firstName} ${annonce.agent.lastName}`
                                : "Nos équipes"}{" "}
                        </h2>
                        <p className="font-ligh mt-2 text-lg tracking-widest text-gray-600">
                            {annonce.agent?.role ? annonce.agent.role : "agent"}
                        </p>
                        <Image
                            src={agent?.icone ? `data:image/jpeg;base64,${agent.icone}` : "/assets/defaultUs.png"}
                            alt="photo-agent"
                            width={1920}
                            height={400}
                            className="my-8 h-[244px] w-auto object-cover"
                        />
                        <p className="font-oswald text-2xl">E-mail</p>
                        <p className="mt-2 font-light">{annonce.agent?.email || "contactUs@immonext.com"}</p>
                        {session &&
                            (session.user?.role === "ADMIN" || Number(session.user?.id) === annonce.agent?.id) && (
                                <Link
                                    className="font-oswald mt-4 w-full bg-black py-2 text-center text-white hover:underline"
                                    href={`/annonces/edit/${params.id}`}>
                                    Editer
                                </Link>
                            )}
                    </div>
                </div>

                <div className="mt-16 w-full">
                    <h3 className="font-oswald mb-6 text-[18px] font-medium">FAQ</h3>
                    {annonce.questions && annonce.questions.length > 0 ? (
                        <div className="max-h-[400px] space-y-6 overflow-y-scroll">
                            {annonce.questions.map((q) => (
                                <div key={q.id} id={`question${q.id}`} className="p-4 shadow-sm">
                                    <p className="font-medium text-gray-900">
                                        <span className="text-gray-800">{q.authorName ?? "Utilisateur anonyme"}</span> :
                                    </p>
                                    <p className="mt-1 text-gray-700">{q.content}</p>

                                    <div className="mt-2 border-t border-gray-300 pt-2 text-gray-700">
                                        {q.answer ? (
                                            <div className="pl-10">
                                                <p className="font-semibold">Réponse :</p>
                                                <p>{q.answer}</p>
                                                <p className="text-sm text-gray-500">
                                                    — {q.answerAuthorName ?? "Agent"} le{" "}
                                                    {q.answeredAt ? new Date(q.answeredAt).toLocaleDateString() : ""}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-500 italic">Pas encore de réponse.</p>
                                                {session &&
                                                    (session.user?.role === "ADMIN" ||
                                                        Number(session.user?.id) === annonce.agent?.id) && (
                                                        <AnswerQuestionButton questionId={q.id} />
                                                    )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Aucune question posée pour le moment.</p>
                    )}

                    {session && <AddQuestionButton annonceId={annonce.id} />}
                </div>
            </div>
        </AnnonceDetailClient>
    );
}
