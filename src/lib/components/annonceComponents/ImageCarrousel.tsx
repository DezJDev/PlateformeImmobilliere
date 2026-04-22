"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageCarrouselProps {
    images: string[];
    titre: string;
}

export default function ImageCarrousel({ images, titre }: ImageCarrouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-200 text-gray-500">
                Aucune image disponible
            </div>
        );
    }

    return (
        <div className="relative aspect-video h-auto w-full">
            {/* Image principale */}
            <div className="h-full w-full overflow-hidden rounded-xl">
                <Image
                    src={images[currentIndex]}
                    alt={`${titre} - Image ${currentIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="transition-opacity duration-300 ease-in-out"
                    priority={currentIndex === 0}
                />
            </div>

            {/* Flèche Gauche */}
            {images.length > 1 && (
                <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
                    <button
                        onClick={goToPrevious}
                        className="bg-opacity-40 hover:bg-opacity-60 rounded-full bg-black p-2 text-white transition"
                        aria-label="Image précédente">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Flèche Droite */}
            {images.length > 1 && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
                    <button
                        onClick={goToNext}
                        className="bg-opacity-40 hover:bg-opacity-60 rounded-full bg-black p-2 text-white transition"
                        aria-label="Image suivante">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Indicateurs (points) */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                    {images.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`h-3 w-3 rounded-full transition ${currentIndex === slideIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"}`}
                            aria-label={`Aller à l'image ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
