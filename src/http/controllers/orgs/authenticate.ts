import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error.js";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { org } = await authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign({
      sub: org.id,
    });

    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: org.id,
          expiresIn: "7d",
        },
      },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
