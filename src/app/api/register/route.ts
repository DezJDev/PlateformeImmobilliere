import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/services/userService";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
    try {
        const { email, firstname, lastname, password, dob } = await req.json();

        if (!email || !firstname || !lastname || !password || !dob) {
            return NextResponse.json({ message: "Tous les champs sont requis." }, { status: 400 });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: "Un utilisateur avec cet email existe déjà." }, { status: 409 });
        }

        const newUser = await createUser({
            email,
            firstname,
            lastname,
            password,
            dob: new Date(dob),
            role: Role.USER,
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 200 });
    } catch (error) {
        console.error("Erreur API lors de la création de l'utilisateur:", error);
        return NextResponse.json({ message: "Erreur interne du serveur." }, { status: 500 });
    }
}
