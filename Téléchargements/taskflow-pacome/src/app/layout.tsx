// Layout racine de l'application
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow - Gérez vos tâches efficacement",
  description: "Application moderne pour organiser et gérer vos tâches quotidiennes",
  authors: [{ name: "TaskFlow Team" }],
  keywords: ["tâches", "productivité", "organisation", "gestion"],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen text-gray-900">
        {children}
      </body>
    </html>
  );
}
