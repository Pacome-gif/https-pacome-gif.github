"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/useAuth";

export default function Login() {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email invalide");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/accueil");
      }, 500);
    } else {
      setError(result.error || authError || "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full">
              <FaUser size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Connexion</h1>
          <p className="text-center text-gray-500 mb-8">Accédez à votre compte TaskFlow</p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              Connexion réussie! Redirection...
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Pas encore de compte? <Link href="/register" className="text-blue-600 font-bold hover:underline">S&apos;inscrire</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
