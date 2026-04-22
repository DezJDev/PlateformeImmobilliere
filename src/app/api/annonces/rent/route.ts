import { getToBuyAnnoncesPagined, getToRentAnnoncesPagined } from "@/lib/services/annonceService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const cursor = searchParams.get("cursor")
    ? Number(searchParams.get("cursor"))
    : undefined;

  const result = await getToRentAnnoncesPagined({ limit, cursor });

  return NextResponse.json(result);
}
