import type {
  Pet,
  PetAge,
  PetEnvironment,
  PetIndependence,
  PetSize,
  PetType,
  Prisma,
  State,
} from "@/generated/prisma/client.js";

export interface FindManyPetsParams {
  city: string;
  state?: State;
  type?: PetType;
  age?: PetAge;
  size?: PetSize;
  energy?: number;
  independence?: PetIndependence;
  environment?: PetEnvironment;
}

export type PetWithRelations = Prisma.PetGetPayload<{
  include: {
    images: true;
    requirements: true;
  };
}>;

export interface PetsRepository {
  findById(id: string): Promise<Pet | null>;
  findMany(params: FindManyPetsParams): Promise<PetWithRelations[]>;
  create(data: Prisma.PetCreateInput): Promise<PetWithRelations>;
}
