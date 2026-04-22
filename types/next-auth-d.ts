import { Role } from "@prisma/client";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Étendre le type JWT
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        role?: Role;
    }
}

// Étendre le type Session
declare module "next-auth" {
    interface Session {
        user?: {
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            role?: Role;
            dob?: Date | null;
            createdAt?: Date | null;
        } & DefaultSession["user"];
    }

    // Optionnel : étendre le type User si vous voulez l'utiliser dans le callback jwt
    interface User {
        firstName?: string | null;
        lastName?: string | null;
        role?: Role;
        dob?: Date | null;
        createdAt?: Date | null;
    }
}
