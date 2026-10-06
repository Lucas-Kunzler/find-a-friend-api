import { makeFindPetByIdUseCase } from "@/use-cases/factories/make-find-pet-by-id-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const findByIdParamsSchema = z.object({
  id: z.uuid(),
});

export async function findById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = findByIdParamsSchema.parse(request.params);

  const findPetByIdUseCase = makeFindPetByIdUseCase();

  const { pet } = await findPetByIdUseCase.execute({
    id,
  });

  return reply.status(200).send({
    pet,
  });
}
