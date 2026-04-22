"use client";

import { useSmoothScrollHash } from "@/hook/useSmoothScrollHash";

export function AnnonceDetailClient({ children }: { children: React.ReactNode }) {
    useSmoothScrollHash();
    return <>{children}</>;
}
