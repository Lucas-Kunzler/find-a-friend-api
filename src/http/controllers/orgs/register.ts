import { State } from "@/generated/prisma/enums.js";
import { OrgAlreadyExistsError } from "@/use-cases/errors/org-already-exists-error.js";
import { makeRegisterOrgUseCase } from "@/use-cases/factories/make-register-org-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const registerBodySchema = z.object({
  name: z
    .string({ error: "O nome é obrigatório." })
    .min(1, "O nome é obrigatório."),
  email: z.email({ error: "E-mail inválido." }),
  cep: z
    .string({ error: "O CEP é obrigatório." })
    .min(1, "O CEP é obrigatório."),
  address: z
    .string({ error: "O endereço é obrigatório." })
    .min(1, "O endereço é obrigatório."),
  city: z
    .string({ error: "A cidade é obrigatória." })
    .min(1, "A cidade é obrigatória."),
  state: z.enum(State, { error: "Estado inválido." }),
  whatsapp: z
    .string({ error: "O WhatsApp é obrigatório." })
    .min(1, "O WhatsApp é obrigatório."),
  password: z
    .string({ error: "A senha é obrigatória." })
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, cep, address, city, state, whatsapp, password } =
    registerBodySchema.parse(request.body);

  try {
    const registerUseCase = makeRegisterOrgUseCase();

    await registerUseCase.execute({
      name,
      email,
      cep,
      address,
      city,
      state,
      whatsapp,
      password,
    });
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
