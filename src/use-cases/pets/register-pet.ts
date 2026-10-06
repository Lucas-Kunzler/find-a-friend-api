import type {
  Pet,
  PetAge,
  PetEnvironment,
  PetIndependence,
  PetSize,
  PetType,
} from "@/generated/prisma/client.js";
import type { OrgsRepository } from "@/repositories/orgs-repository.js";
import type { PetsRepository } from "@/repositories/pets-repository.js";
import type { Storage } from "@/storage/storage.js";

import { ResourceNotFoundError } from "../errors/resource-not-found-error.js";

interface RegisterUseCaseRequest {
  name: string;
  about: string;
  type: PetType;
  age: PetAge;
  energy: number;
  size: PetSize;
  independence: PetIndependence;
  environment: PetEnvironment;
  orgId: string;

  requirements?: { description: string }[];

  images?: {
    filename: string;
    buffer: Buffer;
    contentType: string;
  }[];
}

interface RegisterUseCaseResponse {
  pet: Pet;
}

export class RegisterPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
    private storage: Storage,
  ) {}

  async execute({
    name,
    about,
    age,
    energy,
    environment,
    independence,
    size,
    type,
    requirements = [],
    images = [],
    orgId,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId);

    if (!org) {
      throw new ResourceNotFoundError();
    }

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        return this.storage.save(
          image.buffer,
          image.filename,
          image.contentType,
        );
      }),
    );

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      energy,
      environment,
      independence,
      size,
      type,
      org: {
        connect: {
          id: org.id,
        },
      },
      requirements: {
        create: requirements,
      },
      images: {
        create: imageUrls.map((url) => ({
          url,
        })),
      },
    });

    return { pet };
  }
}
