import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { ListPetsUseCase } from "../pets/list-pets.js";

export function makeListPetUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const listPetsUseCase = new ListPetsUseCase(petsRepository);

  return listPetsUseCase;
}
