"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../pg";

interface Params {
  text: string;
  author: string;
  communityId?: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    const createdThread = await prisma.thread.create({
      data: {
        text,
        author: {
          connect: { id: author },
        },
        community: communityId
          ? {
              connect: { id: communityId },
            }
          : undefined,
      },
    });
    revalidatePath(path);

    return createdThread;
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}
