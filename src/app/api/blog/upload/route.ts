import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Upload to Vercel Blob (requires BLOB_READ_WRITE_TOKEN in Vercel environment variables)
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Error uploading to Vercel Blob:", error);
    return NextResponse.json({ error: "Falha ao enviar arquivo para o Vercel Blob: " + error.message }, { status: 500 });
  }
}
