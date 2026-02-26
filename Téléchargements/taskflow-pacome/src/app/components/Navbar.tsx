"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/utils/useAuth";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // client-only flag; simply check for window
  const mounted = typeof window !== "undefined";

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg h-[11vh] flex items-center px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-white cursor-pointer hover:opacity-90 transition">📋 TaskFlow</h1>
          </Link>
          <ul className="flex gap-8 items-center">
            <li><Link href="/" className="text-white hover:text-blue-100 transition font-medium">Accueil</Link></li>
            {mounted && user ? (
              <>
                <li><Link href="/accueil" className="text-white hover:text-blue-100 transition font-medium">Accueil</Link></li>
                <li><Link href="/tasks" className="text-white hover:text-blue-100 transition font-medium">Tâches</Link></li>
                <li className="text-white font-medium">Bienvenue, {user.name}!</li>
                <li>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading || authLoading}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition font-medium"
                  >
                    {isLoading ? "Déconnexion..." : "Déconnexion"}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/login" className="text-white hover:text-blue-100 transition font-medium">Connexion</Link></li>
                <li><Link href="/register" className="text-white hover:text-blue-100 transition font-medium">S&apos;inscrire</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
