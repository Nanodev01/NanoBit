"use server";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";

// --- PERFIL ---
export async function updateProfile(formData: FormData) {
  await verifyAuth();

  const title = (formData.get("title") as string)?.trim() || "Software Programmer & Cybersecurity";
  const description = (formData.get("description") as string)?.trim();
  const githubUrl = (formData.get("githubUrl") as string)?.trim() || null;
  const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
  const discordUrl = (formData.get("discordUrl") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  
  if (!description) return { error: "La descripción no puede estar vacía" };

  const profile = await prisma.profile.findFirst();
  
  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        title,
        description,
        githubUrl,
        linkedinUrl,
        discordUrl,
        email,
      },
    });
  } else {
    await prisma.profile.create({
      data: {
        title,
        description,
        githubUrl,
        linkedinUrl,
        discordUrl,
        email,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// --- MENSAJES ---
export async function markMessageAsRead(id: string) {
  await verifyAuth();

  await prisma.message.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin/dashboard");
}

export async function deleteMessage(id: string) {
  await verifyAuth();

  await prisma.message.delete({
    where: { id },
  });
  revalidatePath("/admin/dashboard");
}

// --- PROYECTOS ---
export async function createProject(formData: FormData) {
  await verifyAuth();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const tags = formData.get("tags") as string;
  const published = formData.get("published") === "on";

  const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

  await prisma.project.create({
    data: {
      title,
      description,
      url,
      repoUrl,
      published,
      tags: JSON.stringify(tagsArray)
    }
  });

  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: string) {
  await verifyAuth();

  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/");
}

// --- BLOG ---
export async function createPost(formData: FormData) {
  await verifyAuth();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const published = formData.get("published") === "on";
  
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const slug = `${baseSlug}-${Date.now()}`;

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      type,
      imageUrl,
      published
    }
  });

  revalidatePath("/admin/dashboard/blog");
  revalidatePath("/");
  return { success: true };
}

export async function deletePost(id: string) {
  await verifyAuth();

  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/dashboard/blog");
  revalidatePath("/");
}

// --- FOTOS (/LENTE) ---
export async function createPhoto(formData: FormData) {
  await verifyAuth();

  const title = (formData.get("title") as string)?.trim();
  const location = (formData.get("location") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || "Paisaje";
  const cameraInfo = (formData.get("cameraInfo") as string)?.trim() || null;
  const date = (formData.get("date") as string)?.trim() || null;
  const published = formData.get("published") === "on";

  if (!title) {
    return { error: "El título de la foto es obligatorio" };
  }

  let finalImageUrl = (formData.get("imageUrl") as string)?.trim() || "";

  // Procesar archivo subido localmente si existe
  const file = formData.get("file") as File | null;
  if (file && file.size > 0 && typeof file.arrayBuffer === "function") {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
      await fs.mkdir(uploadDir, { recursive: true });

      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
      const filename = `${Date.now()}-${safeName}`;
      const fullPath = path.join(uploadDir, filename);

      await fs.writeFile(fullPath, buffer);
      finalImageUrl = `/uploads/photos/${filename}`;
    } catch (err) {
      console.error("Error al guardar archivo en disco:", err);
      return { error: "Error al guardar el archivo en el servidor" };
    }
  }

  if (!finalImageUrl) {
    return { error: "Debes subir una foto o ingresar una URL de imagen válida" };
  }

  await prisma.photo.create({
    data: {
      title,
      location,
      category,
      imageUrl: finalImageUrl,
      cameraInfo,
      date,
      published,
    },
  });

  revalidatePath("/lente");
  revalidatePath("/admin/dashboard/lente");
  return { success: true };
}

export async function deletePhoto(id: string) {
  await verifyAuth();

  await prisma.photo.delete({ where: { id } });
  revalidatePath("/lente");
  revalidatePath("/admin/dashboard/lente");
}
