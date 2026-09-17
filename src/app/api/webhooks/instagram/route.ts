import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get("x-webhook-secret");
    const querySecret = url.searchParams.get("secret");

    const expectedSecret =
      process.env.INSTAGRAM_WEBHOOK_SECRET || process.env.JWT_SECRET;

    // Validación de seguridad para que solo tus automatizaciones autorizadas puedan postear
    if (
      !expectedSecret ||
      (authHeader !== expectedSecret && querySecret !== expectedSecret)
    ) {
      return NextResponse.json(
        { error: "No autorizado: Token secreto inválido o ausente" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Soporta múltiples formatos comunes de Make.com, Zapier o Meta API
    const imageUrl = body.media_url || body.imageUrl || body.image_url;
    const caption = body.caption || body.title || "Captura fotográfica";
    const permalink = body.permalink || null;
    const timestamp = body.timestamp ? new Date(body.timestamp).getFullYear().toString() : new Date().getFullYear().toString();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Falta la URL de la imagen (media_url)" },
        { status: 400 }
      );
    }

    // Extraer automáticamente categoría de los hashtags del caption si existen
    // Ej: "Atardecer en la montaña #Paisaje #Cordillera" -> category = "Paisaje"
    const hashtagMatch = caption.match(/#(\w+)/);
    let category = "Instagram";
    if (hashtagMatch && hashtagMatch[1]) {
      const tag = hashtagMatch[1].toLowerCase();
      if (tag.includes("paisaje")) category = "Paisaje";
      else if (tag.includes("urban") || tag.includes("ciudad")) category = "Urbano";
      else if (tag.includes("natur")) category = "Naturaleza";
      else if (tag.includes("noche") || tag.includes("night")) category = "Noche";
      else {
        // Capitalizar el primer tag
        category = hashtagMatch[1].charAt(0).toUpperCase() + hashtagMatch[1].slice(1);
      }
    }

    // Limpiar el título quitando los hashtags para una visualización más limpia
    const cleanTitle = caption
      .replace(/#\w+/g, "")
      .trim()
      .slice(0, 80) || "Captura de Instagram";

    const photo = await prisma.photo.create({
      data: {
        title: cleanTitle,
        imageUrl: imageUrl,
        category: category,
        location: body.location || "Instagram Feed",
        date: timestamp,
        cameraInfo: permalink ? `Instagram: ${permalink}` : "Publicado vía Instagram",
        published: true,
      },
    });

    revalidatePath("/lente");
    revalidatePath("/");

    return NextResponse.json(
      {
        success: true,
        message: "Foto sincronizada exitosamente en /lente",
        photoId: photo.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en webhook de Instagram:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el webhook" },
      { status: 500 }
    );
  }
}
