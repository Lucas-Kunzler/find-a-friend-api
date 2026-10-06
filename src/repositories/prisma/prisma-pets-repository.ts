import type { Pet, Prisma } from "@/generated/prisma/client.js";
import type { PetCreateInput } from "@/generated/prisma/models.js";
import { prisma } from "@/lib/prisma.js";
import type {
  FindManyPetsParams,
  PetsRepository,
  PetWithRelations,
} from "../pets-repository.js";

export class PrismaPetsRepository implements PetsRepository {
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
    const pets = await prisma.pet.findMany({
      where: {
        org: {
          city,
          ...(state && { state }),
        },

        ...(type && { type }),
        ...(age && { age }),
        ...(size && { size }),
        ...(energy !== undefined && { energy }),
        ...(independence && { independence }),
        ...(environment && { environment }),
      },
      include: {
        images: true,
        requirements: true,
      },
    });

    return pets;
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    });

    return pet;
  }
  async create(data: PetCreateInput): Promise<PetWithRelations> {
    const pet = await prisma.pet.create({
      data,
      include: {
        images: true,
        requirements: true,
      },
    });

    return pet;
  }
}
