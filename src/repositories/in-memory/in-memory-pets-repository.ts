import type { Pet, Prisma } from "@/generated/prisma/client.js";
import { randomUUID } from "node:crypto";
import type {
  FindManyPetsParams,
  PetsRepository,
  PetWithRelations,
} from "../pets-repository.js";
import type { InMemoryOrgsRepository } from "./in-memory-orgs-repository.js";

export class InMemoryPetsRepository implements PetsRepository {
  public items: PetWithRelations[] = [];

  constructor(private orgsRepository: InMemoryOrgsRepository) {}

  async findMany({
    city,
    state,
    type,
    age,
    size,
    energy,
    independence,
    environment,
  }: FindManyPetsParams): Promise<PetWithRelations[]> {
    return this.items.filter((pet) => {
      const org = this.orgsRepository.items.find((org) => org.id === pet.orgId);

      if (!org) {
        return false;
      }

      if (org.city !== city) return false;
      if (state && org.state !== state) return false;
      if (type && pet.type !== type) return false;
      if (age && pet.age !== age) return false;
      if (size && pet.size !== size) return false;
      if (energy && pet.energy !== energy) return false;
      if (independence && pet.independence !== independence) return false;
      if (environment && pet.environment !== environment) return false;

      return true;
    });
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = this.items.find((item) => item.id === id);

    if (!pet) {
      return null;
    }

    return pet;
  }

  async create(data: Prisma.PetCreateInput): Promise<PetWithRelations> {
    const petId = randomUUID();
    const requirements = Array.isArray(data.requirements?.create)
      ? data.requirements.create
      : [];

    const images = Array.isArray(data.images?.create) ? data.images.create : [];

    const pet = {
      id: petId,
      name: data.name,
      about: data.about,
      age: data.age,
      energy: data.energy,
      environment: data.environment,
      independence: data.independence,
      size: data.size,
      type: data.type,
      created_at: new Date(),
      updated_at: new Date(),
      images: images.map((image) => ({
        id: randomUUID(),
        url: image.url,
        petId,
        created_at: new Date(),
      })),
      requirements: requirements.map((requirement) => ({
        id: randomUUID(),
        description: requirement.description,
        petId,
        created_at: new Date(),
      })),
      orgId: data.org.connect?.id!,
    };

    this.items.push(pet);

    return pet;
  }
}
