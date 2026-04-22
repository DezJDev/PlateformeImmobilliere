"use client";

import { useEffect } from "react";

export function useSmoothScrollHash() {
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);

                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            inline: "nearest",
                        });
                    }, 100);
                }
            }
        };

        scrollToHash();

        window.addEventListener("hashchange", scrollToHash);

        return () => {
            window.removeEventListener("hashchange", scrollToHash);
        };
    }, []);
}

export function SmoothScrollToHash() {
    useSmoothScrollHash();
    return null;
}
