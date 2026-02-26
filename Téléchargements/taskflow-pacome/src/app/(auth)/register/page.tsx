"use client";

import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/useAuth";

export default function Register() {
  const router = useRouter();
  const { register, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Email invalide");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const result = await register(formData.email, formData.password, formData.name);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/accueil");
      }, 500);
    } else {
      setError(result.error || authError || "Erreur d'inscription");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-full">
              <FaUserPlus size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">S&apos;inscrire</h1>
          <p className="text-center text-gray-500 mb-8">Créez votre compte TaskFlow</p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              Inscription réussie! Redirection...
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="Jean Dupont"
              />
            </div>
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-blue-700 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Inscription..." : "S&apos;inscrire"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">Vous avez déjà un compte? <Link href="/login" className="text-blue-600 font-bold hover:underline">Se connecter</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
