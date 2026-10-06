import { makeListOrgsUseCase } from "@/use-cases/factories/make-list-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const listQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
});

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const { page } = listQuerySchema.parse(request.query);
  const listUseCase = makeListOrgsUseCase();
  const { orgs } = await listUseCase.execute({ page });
  return reply.status(200).send({ orgs });
}
