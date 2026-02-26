import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// simple type representing a user stored in mock DB
interface UserRecord {
  id: number | string;
  email: string;
  password: string;
  name?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Récupérer tous les utilisateurs
    const usersResponse = await fetch("http://localhost:3001/users");
    const users = await usersResponse.json();

    // Trouver l'utilisateur
   const user = users.find(
  (u: UserRecord) => u.email === email && u.password === password
      );

    if (!user) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Générer un token
    const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

    // Sauvegarder les cookies
    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set("userData", JSON.stringify(user), {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { message: "Connexion réussie", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
}
