import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedUsers() {
  const users = Array.from({ length: 30 }).map((_, i) => {
    const id = `user-id-${i + 1}`;
    const username = `user${i + 1}`;
    const name = `User ${i + 1}`;
    const bio = `Это биография пользователя №${i + 1}`;
    const image = `https://randomuser.me/api/portraits/${
      i % 2 === 0 ? "men" : "women"
    }/${i + 10}.jpg`; // разные фото мужчин и женщин

    return {
      id,
      username,
      name,
      bio,
      image,
      onboarded: true,
    };
  });

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        ...user,
        onboarded: true,
      },
      create: {
        ...user,
        onboarded: true,
      },
    });
  }

  console.log("✅ 30 пользователей успешно добавлены!");
}

async function main() {
  console.log("🌱 Запускаем сидинг...");
  await seedUsers();
  console.log("🌱 Сидинг завершён");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
