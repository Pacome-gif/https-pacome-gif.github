import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaUser, FaUserPlus, FaArrowRight } from "react-icons/fa";

export default function Accueil() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <Navbar />
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">TaskFlow</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Gérez vos tâches efficacement, organisez votre journée et restez productif
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
                        {/* Bouton Login */}
                        <Link href="/login">
                            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-10 border border-blue-100 hover:border-blue-300">
                                <div className="flex flex-col items-center">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-full mb-6 group-hover:scale-110 transition duration-300 shadow-lg">
                                        <FaUser size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        Connexion
                                    </h2>
                                    <p className="text-gray-600 text-center mb-8 text-sm">
                                        Accédez à votre compte et gérez vos tâches
                                    </p>
                                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-lg flex items-center gap-2 group-hover:gap-3">
                                        Se connecter <FaArrowRight size={16} className="group-hover:translate-x-1 transition" />
                                    </button>
                                </div>
                            </div>
                        </Link>

                        {/* Bouton Register */}
                        <Link href="/register">
                            <div className="group bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer p-10 border-2 border-green-200 hover:border-green-400">
                                <div className="flex flex-col items-center">
                                    <div className="bg-gradient-to-r from-green-500 to-blue-600 p-5 rounded-full mb-6 group-hover:scale-110 transition duration-300 shadow-lg">
                                        <FaUserPlus size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        S&apos;inscrire
                                    </h2>
                                    <p className="text-gray-600 text-center mb-8 text-sm">
                                        Créez un compte pour commencer votre aventure
                                    </p>
                                    <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-600 hover:to-blue-700 transition duration-300 shadow-lg flex items-center gap-2 group-hover:gap-3">
                                        S&apos;inscrire <FaArrowRight size={16} className="group-hover:translate-x-1 transition" />
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
