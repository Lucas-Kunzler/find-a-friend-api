import { PrismaPetsRepository } from "@/repositories/prisma/prisma-pets-repository.js";
import { FindPetByIdUseCase } from "../pets/find-pet-by-id.js";

export function makeFindPetByIdUseCase() {
  const petsRepository = new PrismaPetsRepository();
  const findPetByIdUseCase = new FindPetByIdUseCase(petsRepository);

  return findPetByIdUseCase;
}
