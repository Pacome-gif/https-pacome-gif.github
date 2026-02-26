import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, nom et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const usersResponse = await fetch("http://localhost:3001/users");
    const users = await usersResponse.json();

    if (users.some((u: UserRecord) => u.email === email)) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const createResponse = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password: btoa(password), // Simple encodage (à améliorer)
        createdAt: new Date().toISOString(),
      }),
    });

    const user = await createResponse.json();

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
      { message: "Inscription réussie", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
