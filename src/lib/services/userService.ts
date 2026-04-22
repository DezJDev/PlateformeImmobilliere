import prisma from "@/lib/global/globalPrisma";
import { User, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export const createUser = async (data: {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
    dob: Date;
    role: Role;
}): Promise<User> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            email: data.email,
            firstName: data.firstname,
            lastName: data.lastname,
            password: hashedPassword,
            dob: data.dob,
            role: data.role,
        },
    });
    return user;
};

export const getUserById = async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id },
    });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { email },
    });
};

export const verifyUserPassword = async (email: string, password: string): Promise<User | null> => {
    const user = await getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }
    return null;
};

export const updateUserPassword = async (id: number, newPassword: string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
    });
};

export const deleteUser = async (id: number): Promise<User> => {
    return await prisma.user.delete({
        where: { id },
    });
};

export async function getUserWithRelations(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      annonces: { orderBy: { createdAt: "desc" }, take: 12 },
      questions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      answers: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { annonces: true, questions: true, answers: true } },
    },
  });
}