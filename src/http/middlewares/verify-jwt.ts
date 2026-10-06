import type { FastifyRequest, FastifyReply } from "fastify";

async function verifyAccessToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    return true;
  } catch (err) {
    reply.status(401).send({
      message: "Unauthorized",
    });
    return false;
  }
}

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  await verifyAccessToken(request, reply);
}

export async function verifyJWTBeforeParsing(
  request: FastifyRequest,
  reply: FastifyReply,
  payload: unknown,
) {
  const isAuthenticated = await verifyAccessToken(request, reply);

  if (!isAuthenticated) {
    return;
  }

  return payload;
}
