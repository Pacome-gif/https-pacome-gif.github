import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaCalendarCheck, FaRocket } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { GoTasklist } from "react-icons/go";
import { MdFormatListNumbered } from "react-icons/md";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full py-12">
        <div className="w-full text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-center leading-tight text-gray-900 mb-4">
            L&apos;avenir n&apos;attend pas le{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-full text-white inline-block mt-2">
              futur.
            </span>
          </h1>

          <p className="text-center mt-8 text-gray-600 text-xl max-w-2xl mx-auto">
            Organisez vos tâches efficacement avec TaskFlow - L&apos;application mobile qui vous aide à gérer votre quotidien
          </p>

          {/* Icônes décoratives */}
          <div className="hidden lg:block relative mt-12 mb-12 h-40">
            <MdFormatListNumbered
              size={50}
              className="absolute bottom-20 right-10 rounded-2xl shadow-lg text-blue-500 px-3 py-2 bg-blue-50 hover:scale-110 transition"
            />
            <GoTasklist
              size={50}
              className="absolute -top-8 right-0 rounded-2xl shadow-lg text-blue-600 px-3 py-2 bg-blue-50 hover:scale-110 transition"
            />
            <LuListTodo
              size={50}
              className="absolute left-10 bottom-20 px-3 py-2 rounded-2xl text-blue-500 bg-blue-50 hover:scale-110 transition"
            />
            <FaCalendarCheck
              size={50}
              className="absolute top-0 left-0 rounded-2xl shadow-lg text-blue-600 px-3 py-2 bg-blue-50 hover:scale-110 transition"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 mt-12 justify-center flex-wrap">
            <Link href="/accueil">
              <button className="bg-white border-2 border-blue-600 text-blue-600 px-10 py-3 rounded-full font-bold hover:bg-blue-50 transition duration-300 flex items-center gap-2">
                <FaRocket size={18} /> Commencer
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-3 rounded-full font-bold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg">
                S&apos;inscrire maintenant
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
