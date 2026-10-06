import { State } from "@/generated/prisma/enums.js";
import { makeUpdateOrgUseCase } from "@/use-cases/factories/make-update-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const updateBodySchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  cep: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.enum(State).optional(),
  whatsapp: z.string().min(1).optional(),
});

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const data = updateBodySchema.parse(request.body);

  const updateUseCase = makeUpdateOrgUseCase();

  const { org } = await updateUseCase.execute({
    orgId: request.user.sub,
    data,
  });

  return reply.status(200).send({ org });
}
