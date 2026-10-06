import {
  PetAge,
  PetEnvironment,
  PetIndependence,
  PetSize,
  PetType,
  State,
} from "@/generated/prisma/enums.js";
import { makeListPetUseCase } from "@/use-cases/factories/make-list-pets-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const listQuerySchema = z.object({
  city: z
    .string({ error: "A cidade é obrigatória." })
    .trim()
    .min(1, "A cidade é obrigatória."),
  state: z.enum(State).optional(),
  type: z.enum(PetType).optional(),
  age: z.enum(PetAge).optional(),
  size: z.enum(PetSize).optional(),
  energy: z.coerce.number().int().min(1).max(5).optional(),
  independence: z.enum(PetIndependence).optional(),
  environment: z.enum(PetEnvironment).optional(),
});

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { city, state, type, age, size, energy, independence, environment } =
    listQuerySchema.parse(request.query);

  const listPetsUseCase = makeListPetUseCase();

  const { pets } = await listPetsUseCase.execute({
    city,
    ...(state && { state }),
    ...(type && { type }),
    ...(age && { age }),
    ...(size && { size }),
    ...(energy !== undefined && { energy }),
    ...(independence && { independence }),
    ...(environment && { environment }),
  });

  return reply.status(200).send({
    pets,
  });
}
