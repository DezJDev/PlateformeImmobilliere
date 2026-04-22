"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Dropzone from "react-dropzone";

interface UserProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    icone: string;
    role: string;
}

export default function EditUserForm({ user, isAdmin = false }: { user: UserProps; isAdmin?: boolean }) {
    const router = useRouter();
    const { update } = useSession();

    const [firstName, setFirstName] = useState(user.firstName || "");
    const [lastName, setLastName] = useState(user.lastName || "");
    const [email, setEmail] = useState(user.email || "");
    const [dob, setDob] = useState(
        user.dob ? user.dob.split("T")[0] : ""
    );
    const [role, setRole] = useState(user.role || "USER");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [photoPrincipaleFile, setPhotoPrincipaleFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [initialMainPhoto, setInitialMainPhoto] = useState<string | null>(null);

    useEffect(() => {
        if (user.icone) {
            const url =
                user.icone.startsWith("data:image") || user.icone.startsWith("http")
                    ? user.icone
                    : `data:image/jpeg;base64,${user.icone}`;
            setInitialMainPhoto(url);
        } else {
            setInitialMainPhoto(null);
        }
    }, [user.icone]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("firstName", firstName);
            fd.append("lastName", lastName);
            fd.append("email", email);
            fd.append("dob", dob);

            if (isAdmin) {
                fd.append("role", role);
            }

            if (photoPrincipaleFile) {
                fd.append("icon", photoPrincipaleFile);
                fd.append("icone", photoPrincipaleFile);
            }

            const res = await fetch(`/api/user/${user.id}`, {
                method: "PUT",
                body: fd,
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Erreur lors de la mise à jour.");
            }

            const json = await res.json();

            await update();

            const newIcon =
                typeof json.icone === "string" && json.icone.length > 0
                    ? json.icone.startsWith("data:")
                        ? json.icone
                        : `data:image/jpeg;base64,${json.icone}`
                    : null;

            setPreviewUrl(null);
            setInitialMainPhoto(newIcon);

            router.push(`/profil/${user.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible.")) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/user/${user.id}`, { method: "DELETE" });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Erreur lors de la suppression du compte.");
            }
            router.push(`/`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function onDrop(files: File[]) {
        const f = files[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) {
            setError("Fichier trop volumineux (max 5 Mo).");
            return;
        }
        setError(null);
        setPhotoPrincipaleFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-center text-2xl font-semibold text-gray-800">Modifier le profil</h2>

                {initialMainPhoto && (
                    <div className="mt-4 flex flex-col items-center">
                        <img
                            src={initialMainPhoto}
                            alt="Photo de profil"
                            className="h-32 w-32 rounded-full object-cover ring-1 ring-gray-300"
                        />
                    </div>
                )}

                {error && <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="mt-1 w-full rounded-md border px-3 py-2"
                        required
                    />
                </div>

                {isAdmin && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rôle</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 w-full rounded-md border bg-white px-3 py-2">
                            <option value="USER">Utilisateur</option>
                            <option value="AGENT">Agent</option>
                            <option value="ADMIN">Administrateur</option>
                        </select>
                    </div>
                )}

                <Dropzone
                    multiple={false}
                    onDrop={onDrop}
                    accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/webp": [".webp"],
                    }}
                    maxFiles={1}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div
                                {...getRootProps()}
                                className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 text-center hover:bg-gray-100">
                                <input {...getInputProps()} />
                                <p>Glissez-déposez votre photo, ou cliquez pour sélectionner.</p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (max 5 Mo)</p>
                            </div>
                        </section>
                    )}
                </Dropzone>

                {previewUrl && (
                    <div className="mt-4 flex flex-col items-center">
                        <img
                            src={previewUrl}
                            alt="Prévisualisation"
                            className="h-32 w-32 rounded-full object-cover ring-1 ring-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setPhotoPrincipaleFile(null);
                                setPreviewUrl(null);
                            }}
                            className="mt-2 rounded-md border px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
                            Retirer la photo
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:cursor-pointer hover:bg-black disabled:bg-gray-400">
                    {loading ? "Mise à jour..." : "Enregistrer"}
                </button>

                <button
                    onClick={handleDeleteAccount}
                    type="button"
                    disabled={loading}
                    className="w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:cursor-pointer hover:bg-red-700 disabled:bg-gray-400">
                    Supprimer le compte
                </button>
            </form>
        </div>
    );
}
