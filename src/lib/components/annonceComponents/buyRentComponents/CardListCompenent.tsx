import { headers } from "next/headers";
import CardListClient from "./cardListClient";

type Props = { type: string };

async function fetchInitial(type: string) {
    const h = headers();
    const host = (await h).get("x-forwarded-host") ?? (await h).get("host");
    const proto = (await h).get("x-forwarded-proto") ?? "http";
    const baseUrl = `${proto}://${host}`;

    const res = await fetch(`${baseUrl}/api/annonces/${type}?limit=4`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return { items: [], nextCursor: undefined, hasMore: false };
    }

    return res.json();
}

export default async function CardList({ type }: Props) {
    const data = await fetchInitial(type);

    return (
        <CardListClient
            type={type}
            initialItems={data.items ?? []}
            initialCursor={data.nextCursor}
            initialHasMore={Boolean(data.hasMore)}
        />
    );
}
