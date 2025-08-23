"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../pg";

interface ICreateUser {
  userInfo: {
    username: string;
    name: string;
    bio: string;
    image: string;
    id?: string;
  };
  path: string;
}

export async function updateUser({ userInfo, path }: ICreateUser) {
  try {
    await prisma.user.upsert({
      where: { id: userInfo.id },
      update: {
        ...userInfo,
        username: userInfo.username.toLowerCase(),
        onboarded: true,
      },
      create: {
        ...userInfo,
        username: userInfo.username.toLowerCase(),
        onboarded: true,
      },
    });

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        communities: true,
        threads: true,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    const userWithThreads = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        threads: {
          select: {
            id: true,
            text: true,
            parentId: true,
            createdAt: true,
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
              select: {
                id: true,
                text: true,
                createdAt: true,
                authorId: true,
                communityId: true,
                parentId: true,
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

    return userWithThreads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

interface FetchUsersParams {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "asc" | "desc";
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: FetchUsersParams) {
  try {
    // Calculate skip amount for pagination
    const skipAmount = (pageNumber - 1) * pageSize;

    // Build WHERE filter
    const where: any = {
      id: { not: userId }, // exclude current user
    };

    if (searchString.trim() !== "") {
      where.OR = [
        { username: { contains: searchString, mode: "insensitive" } },
        { name: { contains: searchString, mode: "insensitive" } },
      ];
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: sortBy },
      skip: skipAmount,
      take: pageSize,
    });

    // Count total
    const totalUsersCount = await prisma.user.count({ where });

    // Check if there's a next page
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}


export async function getActivity(userId: string) {
  try {
    // 1. Находим все треды, созданные пользователем
    const userThreads = await prisma.thread.findMany({
      where: { authorId: userId },
      select: { id: true, children: true }, // children — это relation
    });

    // 2. Собираем все id детей (ответов)
    const childThreadIds = userThreads.flatMap(thread =>
      thread.children.map(child => child.id)
    );

    if (childThreadIds.length === 0) {
      return [];
    }

    // 3. Находим сами ответы, исключая те, что написал тот же user
    const replies = await prisma.thread.findMany({
      where: {
        id: { in: childThreadIds },
        authorId: { not: userId },
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}