// Utilitaires d'authentification
import { cookies } from "next/headers";

// type used when loading raw user data from mock DB
interface UserRecord extends AuthUser {
  password: string;
  createdAt?: string;
  [key: string]: unknown;
}

const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Enregistrer un utilisateur (mock - à remplacer par un vrai appel API)
 */
export async function registerUser(email: string, password: string, name: string) {
  try {
    // TODO: Remplacer par un vrai appel API
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password: btoa(password), // Simple encodage (à remplacer par bcrypt côté serveur)
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'inscription");
    }

    const user = await response.json();
    return { success: true, user };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Erreur lors de l'inscription" };
  }
}

/**
 * Connecter un utilisateur (mock - à remplacer par un vrai appel API)
 */
export async function loginUser(email: string, password: string) {
  try {
    // TODO: Remplacer par un vrai appel API d'authentification
    const response = await fetch("http://localhost:3001/users");
    const users = await response.json();

    const user = users.find(
      (u: UserRecord) => u.email === email && u.password === btoa(password)
    );

    if (!user) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }

    // Générer un token (mock)
    const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

    return { success: true, user, token };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Erreur lors de la connexion" };
  }
}

/**
 * Sauvegarder le token et les données utilisateur dans les cookies
 */
export async function setAuthCookies(token: string, user: AuthUser) {
  const cookieStore = await cookies();

  // Token valide pendant 7 jours
  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  // Données utilisateur valides pendant 7 jours
  cookieStore.set(USER_KEY, JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * Récupérer le token depuis les cookies
 */
export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value;
}

/**
 * Récupérer les données utilisateur depuis les cookies
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get(USER_KEY)?.value;

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Déconnecter l'utilisateur
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(USER_KEY);
}

/**
 * Vérifier si l'utilisateur est authentifié
 */
export async function isUserAuthenticated() {
  const token = await getAuthToken();
  return !!token;
}
