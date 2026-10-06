import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { RegisterPetsUseCase } from "../pets/register-pet.js";
import { PrismaOrgsRepository } from "@/repositories/prisma/prisma-orgs-repository.js";
import { InMemoryStorage } from "@/storage/in-memory-storage.js";

export function makeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const orgsRepository = new PrismaOrgsRepository();
  const storage = new InMemoryStorage();
  const registerPetsUseCase = new RegisterPetsUseCase(
    petsRepository,
    orgsRepository,
    storage,
  );

  return registerPetsUseCase;
}
