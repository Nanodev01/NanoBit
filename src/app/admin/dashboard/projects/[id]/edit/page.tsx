import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProjectForm } from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let project: any = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    try {
      const raw: any = await prisma.$queryRawUnsafe('SELECT * FROM "Project" WHERE "id" = ? LIMIT 1', id);
      if (raw && raw.length > 0) {
        project = raw[0];
      }
    } catch {}
  }

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}
