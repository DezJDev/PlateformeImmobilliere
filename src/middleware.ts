import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ALLOWED_ROLES = new Set(["AGENT", "ADMIN"]);
const NEEDS_ROLE = ["/annonces/add", "/annonces/edit"];

export async function middleware(request: NextRequest) {
    const { method } = request;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        const origin = request.headers.get("origin");
        const host = new URL(request.url).origin;

        if (origin && origin !== host) {
            return NextResponse.json({ message: "Origine invalide." }, { status: 403 });
        }
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    const role = (token as any).role as string | undefined;
    const path = request.nextUrl.pathname;

    if (NEEDS_ROLE.some((prefix) => path.startsWith(prefix))) {
        if (!role || !ALLOWED_ROLES.has(role)) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/annonces/add", "/annonces/edit/:path*", "/profil/edit/:path*"],
};
