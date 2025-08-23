'use server'
import { prisma } from "../pg";

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
  try {
    // Проверим, что юзер существует
    const user = await prisma.user.findUnique({
      where: { id: createdById },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Создадим коммьюнити и автоматически добавим в список у юзера
    const community = await prisma.community.create({
      data: {
        id,
        name,
        username,
        image,
        bio,
        createdBy: {
          connect: { id: createdById }, // связь по foreign key
        },
        members: {
          connect: { id: createdById }, // чтобы создатель тоже был в members
        },
      },
    });

    return community;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        createdBy: true, // подтянем создателя
        members: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    return community;
  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    const communityWithThreads = await prisma.community.findUnique({
      where: { id },
      include: {
        threads: {
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

    return communityWithThreads;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
}
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "asc" | "desc";
}) {
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const communities = await prisma.community.findMany({
      where: {
        OR: searchString
          ? [
              { username: { contains: searchString, mode: "insensitive" } },
              { name: { contains: searchString, mode: "insensitive" } },
            ]
          : undefined,
      },
      orderBy: { createdAt: sortBy },
      skip: skipAmount,
      take: pageSize,
      include: { members: true }, // аналог populate
    });

    const totalCommunitiesCount = await prisma.community.count({
      where: {
        OR: searchString
          ? [
              { username: { contains: searchString, mode: "insensitive" } },
              { name: { contains: searchString, mode: "insensitive" } },
            ]
          : undefined,
      },
    });

    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}
export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    return await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          connect: { id: memberId },
        },
      },
      include: { members: true },
    });
  } catch (error) {
    console.error("Error adding member to community:", error);
    throw error;
  }
}
export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    await prisma.community.update({
      where: { id: communityId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error removing user from community:", error);
    throw error;
  }
}
export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    return await prisma.community.update({
      where: { id: communityId },
      data: { name, username, image },
    });
  } catch (error) {
    console.error("Error updating community:", error);
    throw error;
  }
}
export async function deleteCommunity(communityId: string) {
  try {
    // Удаляем коммьюнити
    const deletedCommunity = await prisma.community.delete({
      where: { id: communityId },
    });

    // Удаляем все threads этого коммьюнити
    await prisma.thread.deleteMany({
      where: { communityId },
    });

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community:", error);
    throw error;
  }
}
