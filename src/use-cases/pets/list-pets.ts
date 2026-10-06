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

interface ListUseCaseRequest {
  city: string;
  state?: State;
  type?: PetType;
  age?: PetAge;
  size?: PetSize;
  energy?: number;
  independence?: PetIndependence;
  environment?: PetEnvironment;
}

interface ListUseCaseResponse {
  pets: Pet[];
}

export class ListPetsUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    state,
    type,
    age,
    size,
    energy,
    environment,
    independence,
  }: ListUseCaseRequest): Promise<ListUseCaseResponse> {
    const pets = await this.petsRepository.findMany({
      city,
      ...(state && { state }),
      ...(type && { type }),
      ...(age && { age }),
      ...(size && { size }),
      ...(energy !== undefined && { energy }),
      ...(independence && { independence }),
      ...(environment && { environment }),
    });

    return { pets };
  }
}
