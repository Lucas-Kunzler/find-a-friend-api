import { makeGetOrgUseCase } from "@/use-cases/factories/make-get-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const getParamsSchema = z.object({
    orgId: z.uuid({ error: "ID da org inválido." }),
  });

  const { orgId } = getParamsSchema.parse(request.params);

  const getOrgUseCase = makeGetOrgUseCase();

  const { org } = await getOrgUseCase.execute({ orgId });

  return reply.status(200).send({
    org: {
      id: org.id,
      name: org.name,
      email: org.email,
      cep: org.cep,
      address: org.address,
      city: org.city,
      state: org.state,
      whatsapp: org.whatsapp,
    },
  });
}
