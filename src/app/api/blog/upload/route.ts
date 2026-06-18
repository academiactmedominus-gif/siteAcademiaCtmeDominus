import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Não autorizado: Token não fornecido." }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    
    // Verify Firebase ID Token via Google Identity Toolkit API
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Não autorizado: Token inválido." }, { status: 401 });
    }

    const verifyData = await verifyRes.json();
    const uid = verifyData.users?.[0]?.localId;

    if (!uid) {
      return NextResponse.json({ error: "Não autorizado: Usuário não encontrado no token." }, { status: 401 });
    }

    // Verify user role in Firestore
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return NextResponse.json({ error: "Acesso negado: Perfil do usuário não existe." }, { status: 403 });
    }

    const userData = userDocSnap.data();
    if (userData.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado: Apenas administradores podem fazer upload." }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Validate size (under 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "O arquivo excede o limite de 5MB." }, { status: 400 });
    }

    // Validate type (images only)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Apenas imagens são permitidas." }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json({ error: "Falha ao enviar arquivo: " + error.message }, { status: 500 });
  }
}
