import { prisma } from "../pg";

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