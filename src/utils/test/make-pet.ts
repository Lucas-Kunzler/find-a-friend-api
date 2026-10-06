import type { InMemoryPetsRepository } from "@/repositories/in-memory/in-memory-pets-repository.js";

export async function makePet(
  petsRepository: InMemoryPetsRepository,
  orgId: string,
  overrides = {},
) {
  return petsRepository.create({
    name: "Rex",
    about: "Um cachorro muito amigável",
    type: "DOG",
    age: "ADULT",
    energy: 5,
    size: "LARGE",
    independence: "HIGH",
    environment: "LARGE",

    org: {
      connect: {
        id: orgId,
      },
    },

    images: {
      create: [
        {
          url: "http://storage.test/rex.jpg",
        },
      ],
    },

    requirements: {
      create: [
        {
          description: "Ter espaço amplo",
        },
      ],
    },
    ...overrides,
  });
}
