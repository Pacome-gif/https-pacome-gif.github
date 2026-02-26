import { NextRequest, NextResponse } from "next/server";


// Routes privées (nécessitent une authentification)
const PRIVATE_ROUTES = ["/accueil", "/tasks", "/profile", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupérer le token depuis les cookies
  const token = request.cookies.get("authToken")?.value;
  const isAuthenticated = !!token;

  // Si l'utilisateur essaie d'accéder à une route privée sans authentification
  if (PRIVATE_ROUTES.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    // Rediriger vers la page de connexion
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si l'utilisateur authentifié essaie d'accéder aux pages d'auth
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    // Rediriger vers l'accueil
    return NextResponse.redirect(new URL("/accueil", request.url));
  }

  // Laisser passer la requête
  return NextResponse.next();
}

// Configuration du middleware - sur quelles routes l'appliquer
export const config = {
  matcher: [
    // Appliquer sur toutes les routes sauf les fichiers statiques et les APIs spéciales
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
