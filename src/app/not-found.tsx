// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Votre futur bien ne se trouve pas à cette adresse. 
      </p>
      <Link
        href="/"
        className="rounded-md bg-gray-900 px-5 py-3 text-white text-sm font-medium hover:bg-black transition"
      >
        Retour à l’accueil
      </Link>
    </main>
  );
}
