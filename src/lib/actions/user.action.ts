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
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}