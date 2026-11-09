import { prisma } from "@/lib/prisma.js";
import { hash } from "bcryptjs";

const pets = [
  {
    name: "Rex",
    about: "Um cachorro muito amigável",
    type: "DOG",
    age: "ADULT",
    energy: 5,
    size: "LARGE",
    independence: "HIGH",
    environment: "LARGE",
    requirements: ["Ter espaço amplo", "Ter disponibilidade para passeios"],
    images: ["https://picsum.photos/seed/rex1/800/600"],
  },
  {
    name: "Mel",
    about: "Gatinha carinhosa, ótima para apartamento",
    type: "CAT",
    age: "PUPPY",
    energy: 3,
    size: "SMALL",
    independence: "MEDIUM",
    environment: "SMALL",
    requirements: ["Tela de proteção nas janelas"],
    images: ["https://picsum.photos/seed/mel1/800/600"],
  },
  {
    name: "Thor",
    about: "Cachorro tranquilo, já vacinado e castrado",
    type: "DOG",
    age: "SENIOR",
    energy: 2,
    size: "MEDIUM",
    independence: "LOW",
    environment: "MEDIUM",
    requirements: ["Companhia na maior parte do dia"],
    images: ["https://picsum.photos/seed/thor1/800/600"],
  },
] as const;

async function main() {
  const org = await prisma.org.upsert({
    where: { email: "contato@amigofiel.org" },
    update: {},
    create: {
      name: "ONG Amigo Fiel",
      email: "contato@amigofiel.org",
      cep: "93900-000",
      address: "Rua das Flores, 123",
      city: "Ivoti",
      state: "RS",
      whatsapp: "51999999999",
      password_hash: await hash("123456", 6),
    },
  });

  const petsCount = await prisma.pet.count({ where: { orgId: org.id } });
  if (petsCount > 0) {
    console.log("Seed já aplicado, nada a fazer.");
    return;
  }

  for (const { requirements, images, ...pet } of pets) {
    await prisma.pet.create({
      data: {
        ...pet,
        orgId: org.id,
        requirements: {
          create: requirements.map((description) => ({ description })),
        },
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });
  }

  console.log("Seed aplicado com sucesso.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
