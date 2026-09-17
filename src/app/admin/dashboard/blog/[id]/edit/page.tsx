import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditPostForm } from "./EditPostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: any = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    try {
      const raw: any = await prisma.$queryRawUnsafe('SELECT * FROM "Post" WHERE "id" = ? LIMIT 1', id);
      if (raw && raw.length > 0) {
        post = raw[0];
      }
    } catch {}
  }

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} />;
}
