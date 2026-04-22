// src/app/layout.tsx
import type { Metadata } from "next";
import { Oswald, Roboto } from "next/font/google";
import { AuthProvider } from "@/lib/components/AuthComponent";
import "./globals.css";

import Footer from "@/lib/components/layoutRelated/footer";
import { Header } from "@/lib/components/layoutRelated/header";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700"],
    variable: "--font-roboto",
});

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    variable: "--font-oswald",
});

export const metadata: Metadata = {
    title: "ImmoNext",
    description: "A real estate listing platform built with Next.js and Prisma.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="fr" suppressHydrationWarning className={`${roboto.variable} ${oswald.variable}`}>
            <body suppressHydrationWarning className="font-sans antialiased">
                <AuthProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
