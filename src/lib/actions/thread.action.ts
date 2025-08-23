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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  // Сколько пропустить
  const skipAmount = (pageNumber - 1) * pageSize;

  // Получаем посты (только top-level: без parentId)
  const posts = await prisma.thread.findMany({
    where: {
      parentId: null, // эквивалент { $in: [null, undefined] }
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: skipAmount,
    take: pageSize,
    include: {
      author: true,      // Подтягиваем автора
      community: true,   // Подтягиваем комьюнити
      children: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });


  const totalPostsCount = await prisma.thread.count({
    where: { parentId: null },
  });

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}
async function fetchAllChildThreads(threadId: string): Promise<string[]> {
  const children = await prisma.thread.findMany({
    where: { parentId: threadId },
    select: { id: true },
  });

  let allChildIds: string[] = children.map(c => c.id);

  for (const child of children) {
    const descendants = await fetchAllChildThreads(child.id);
    allChildIds.push(...descendants);
  }

  return allChildIds;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    // Найти основной тред
    const mainThread = await prisma.thread.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!mainThread) throw new Error("Thread not found");

    // Получаем все дочерние треды рекурсивно
    const descendantThreadIds = [id, ...(await fetchAllChildThreads(id))];

    // Удаляем треды
    await prisma.thread.deleteMany({
      where: { id: { in: descendantThreadIds } },
    });

    // Сброс кэша страницы
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}


export async function fetchThreadById(threadId: string) {
  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        children: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            children: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}


export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    // проверяем что родительский тред существует
    const originalThread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // создаём новый комментарий и связываем с родительским
    const commentThread = await prisma.thread.create({
      data: {
        text: commentText,
        author: { connect: { id: userId } },
        parent: { connect: { id: threadId } }, // связь с родителем
      },
    });

    // в Prisma children обновлять вручную не надо,
    // связь parent/children работает автоматически

    revalidatePath(path);

    return commentThread;
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
