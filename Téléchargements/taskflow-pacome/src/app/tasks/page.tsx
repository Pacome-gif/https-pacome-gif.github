import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

export default function Tasks() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <Link href="/accueil" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
              <FaArrowLeft size={18} /> Retour à l&apos;accueil
            </Link>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-2">Mes Tâches</h1>
          <p className="text-xl text-gray-600 mb-12">Gérez toutes vos tâches en un seul endroit</p>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg flex items-center gap-2 mb-8">
              <FaPlus size={18} /> Ajouter une tâche
            </button>

            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Aucune tâche pour le moment</p>
              <p className="text-gray-400 mt-2">Cliquez sur &quot;Ajouter une tâche&quot; pour commencer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
