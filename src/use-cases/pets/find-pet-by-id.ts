import type {
  Pet,
  PetAge,
  PetEnvironment,
  PetIndependence,
  PetSize,
  PetType,
  State,
} from "@/generated/prisma/client.js";
import type { PetsRepository } from "@/repositories/pets-repository.js";
import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";

interface FindPetByIdUseCaseRequest {
  id: string;
}

interface FindPetByIdUseCaseResponse {
  pet: Pet;
}

export class FindPetByIdUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    id,
  }: FindPetByIdUseCaseRequest): Promise<FindPetByIdUseCaseResponse> {
    const pet = await this.petsRepository.findById(id);

    if (!pet) {
      throw new ResourceNotFoundError();
    }

    return { pet };
  }
}
