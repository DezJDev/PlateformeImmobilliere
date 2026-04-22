import NextAuth, { type AuthOptions } from "next-auth";
import prisma from "@/lib/global/globalPrisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/**
 * adapter = connexion à la BDD.
 * providers = méthodes de connexion.
 * session = gestion des sessions.
 * callbacks = enrichir les données de session.
 */
export const authOptions: AuthOptions = {
    // L'adaptateur Prisma = lien entre NextAuth et BDD => gère automatiquement l'add/update des données et des sessions.
    providers: [
        /**
         * Provider "Credentials" = basic auth avec mail + mdp.
         * On pourra après ajouter google là
         */
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                firstname: { label: "First Name", type: "text" },
                lastname: { label: "Last Name", type: "text" },
                dob: { label: "Date of Birth", type: "date" },
            },
            // Fonction appelée lors du submit.
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    dob: user.dob,
                    createdAt: user.createdAt,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    // callbacks = fonctions exécutées -> controler + personnaliser le comportement de NextAuth.
    callbacks: {
        // Ce callback est exécuté chaque fois qu'un JWT est créé ou mis à jour.
        async jwt({ token, user, trigger }) {
            // Première connexion
            if (user) {
                token.id = user.id;
                token.firstName = (user as any).firstName;
                token.lastName = (user as any).lastName;
                token.role = (user as any).role;
                token.dob = (user as any).dob;
                token.createdAt = (user as any).createdAt;
                return token;
            }

            // Si on appelle useSession().update()
            if (trigger === "update") {
                const freshUser = await prisma.user.findUnique({
                    where: { id: Number(token.id) },
                });

                if (freshUser) {
                    token.firstName = freshUser.firstName;
                    token.lastName = freshUser.lastName;
                    token.email = freshUser.email;
                    token.role = freshUser.role;
                }
            }

            return token;
        },

        //Ce callback est exécuté chaque fois que la session est consultée côté client.
        async session({ session, token }) {
            // On copie l'ID qui vient du token dans l'objet session.user.
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).firstName = token.firstName;
                (session.user as any).lastName = token.lastName;
                (session.user as any).role = token.role;
                (session.user as any).dob = token.dob;
                (session.user as any).createdAt = token.createdAt;
            }
            // Le client recevra maintenant un objet session contenant user.id.
            return session;
        },
    },

    // Si un utilisateur non connecté essaie d'accéder à une page protégée, il sera redirigé ici.
    pages: {
        signIn: "/login",
    },

    /**
     * Une chaîne de caractères secrète utilisée pour signer les JWT et autres jetons.
     * Indispensable en production pour la sécurité. Doit être stockée dans les variables d'environnement.
     */
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
