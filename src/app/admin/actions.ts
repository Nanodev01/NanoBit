"use server";

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- PERFIL ---
export async function updateProfile(formData: FormData) {
  await verifyAuth();

  const description = formData.get("description") as string;
  
  if (!description) return { error: "La descripción no puede estar vacía" };

  const profile = await prisma.profile.findFirst();
  
  if (profile) {
    await prisma.profile.update({
      where: { id: profile.id },
      data: { description },
    });
  } else {
    await prisma.profile.create({
      data: { title: "Software Engineer", description },
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
  const published = formData.get("published") === "on";
  
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const slug = `${baseSlug}-${Date.now()}`;

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      type,
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
